import { TechnologiesService } from './technologies.service';
import { CreateTechnologyDto } from './dto/create-technology.dto';

describe('TechnologiesService', () => {
  const prisma = {
    technology: {
      create: jest.fn().mockResolvedValue({ id: 'uuid', createdAt: new Date() }),
    },
  } as any;

  let service: TechnologiesService;

  beforeEach(() => {
    service = new TechnologiesService(prisma);
  });

  it('creates a technology with all required fields', async () => {
    const dto: CreateTechnologyDto = {
      name: 'ArgoCD',
      category: 'Tools' as any,
      ring: 'Trial' as any,
      techDescription: 'Argo CD is declarative...',
      ringDescription: 'Without making a judgment ...',
    };

    await service.create(dto);

    expect(prisma.technology.create).toHaveBeenCalledWith({
      data: {
        name: dto.name,
        category: dto.category,
        ring: dto.ring,
        techDescription: dto.techDescription,
        ringDescription: dto.ringDescription,
      },
    });
  });
});
