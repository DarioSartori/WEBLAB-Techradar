import { Ring } from './dto/ring.enum';
import { TechnologiesService } from './technologies.service';

describe('TechnologiesService', () => {
  const prisma = {
    technology: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      findMany: jest.fn(),
    },
  } as any;

  let svc: TechnologiesService;

  beforeEach(() => {
    jest.resetAllMocks();
    svc = new TechnologiesService(prisma);
  });

  it('create: saves Draft (publishedAt null) and optional fields', async () => {
    prisma.technology.create.mockResolvedValue({ id: '1' });
    await svc.create({
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
        ring: null,
        ringDescription: null,
        publishedAt: null,
      }),
    });
  });

  it('publish: sets ring, reason, publishedAt', async () => {
    prisma.technology.update.mockResolvedValue({ id: '1' });
    await svc.publish('1', 'Trial' as Ring, 'Description');
    expect(prisma.technology.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: {
        ring: 'Trial',
        ringDescription: 'Description',
        publishedAt: expect.any(Date),
      },
    });
  });

  it('update: allows to empty draft fields (not published)', async () => {
    prisma.technology.findUnique.mockResolvedValue({
      publishedAt: null,
      ring: 'Trial',
      ringDescription: 'B',
    });
    prisma.technology.update.mockResolvedValue({ id: '1' });
    await svc.update('1', { ring: null, ringDescription: '' as any });
    expect(prisma.technology.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: expect.objectContaining({ ring: null, ringDescription: '' }),
    });
  });
});
