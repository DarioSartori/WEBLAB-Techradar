import { NotFoundException } from '@nestjs/common';
import { Ring } from 'src/technologies/dto/ring.enum';
import { TechnologiesService } from 'src/technologies/technologies.service';

function makePrismaMock() {
  return {
    technology: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
    },
  };
}

describe('TechnologiesService (unit)', () => {
  let service: TechnologiesService;
  let prisma: ReturnType<typeof makePrismaMock>;

  beforeEach(() => {
    prisma = makePrismaMock() as any;
    service = new TechnologiesService(prisma as any);
  });

  it('create: saves Draft and omits optional fields when not provided', async () => {
    const now = new Date().toISOString();
    prisma.technology.create.mockResolvedValue({
      id: 't1',
      name: 'ArgoCD',
      category: 'Tools',
      techDescription: 'desc',
      ring: null,
      ringDescription: null,
      publishedAt: null,
      createdAt: now,
      updatedAt: now,
    });

    const res = await service.create({
      name: 'ArgoCD',
      category: 'Tools' as any,
      techDescription: 'desc',
      ring: undefined,
      ringDescription: undefined,
    });

    expect(prisma.technology.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: 'ArgoCD',
        category: 'Tools',
        techDescription: 'desc',
      }),
    });
    const callData = prisma.technology.create.mock.calls[0][0].data as Record<string, unknown>;
    expect('ring' in callData).toBe(false);
    expect('ringDescription' in callData).toBe(false);

    expect(res.publishedAt).toBeNull();
  });

  it('create: forwards ring and ringDescription when provided', async () => {
    prisma.technology.create.mockResolvedValue({
      id: 't2',
      name: 'Kubernetes',
      category: 'Platforms',
      techDescription: 'k8s',
      ring: 'Trial',
      ringDescription: 'initial',
      publishedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await service.create({
      name: 'Kubernetes',
      category: 'Platforms' as any,
      techDescription: 'k8s',
      ring: Ring.Trial,
      ringDescription: 'initial',
    });

    expect(prisma.technology.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: 'Kubernetes',
        category: 'Platforms',
        techDescription: 'k8s',
        ring: 'Trial',
        ringDescription: 'initial',
      }),
    });
  });

  it('list() drafts only', async () => {
    prisma.technology.findMany.mockResolvedValue([
      { id: 'd1', publishedAt: null },
    ]);
    await service.list('draft');
    expect(prisma.technology.findMany).toHaveBeenCalledWith({
      where: { publishedAt: null },
      select: { category: true, id: true, name: true, publishedAt: true, ring: true, ringDescription: true },
      orderBy: [{ createdAt: 'desc' }],
    });
  });

  it('update() does NOT change ring fields', async () => {
    prisma.technology.update.mockResolvedValue({ id: 't1', name: 'x' });
    await service.update('t1', { name: 'x', ring: 'Adopt' as any } as any);
    const data = prisma.technology.update.mock.calls[0][0].data;
    expect('ring' in data).toBe(false);
    expect('ringDescription' in data).toBe(false);
  });

  it('publish() sets publishedAt and needs both fields', async () => {
    prisma.technology.update.mockResolvedValue({
      id: 't1',
      ring: 'Trial',
      ringDescription: 'init',
      publishedAt: new Date().toISOString(),
    });
    const res = await service.publish('t1', Ring.Trial, 'init');
    expect(res.publishedAt).toBeTruthy();
  });

  it('reclassify() updates ring', async () => {
    prisma.technology.findUnique.mockResolvedValue({
      id: 't1',
      publishedAt: '2024-01-01T00:00:00Z',
    });
    prisma.technology.update.mockResolvedValue({
      id: 't1',
      ring: 'Adopt',
      ringDescription: 'why',
    });
    const res = await service.reclassify('t1', Ring.Adopt, 'why');
    expect(res.ring).toBe('Adopt');
    expect(res.ringDescription).toBe('why');
  });

  it('reclassify() throws NotFound for unknown id', async () => {
    prisma.technology.findUnique.mockResolvedValue(null);
    await expect(
      service.reclassify('nope', Ring.Adopt, 'x'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
