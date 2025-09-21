import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { Ring } from './dto/ring.enum';
import { UpdateTechnologyDto } from './dto/update-technology.dto';

@Injectable()
export class TechnologiesService {
  constructor(private readonly prisma: PrismaClient) {}
  create(dto: CreateTechnologyDto) {
    return this.prisma.technology.create({
      data: {
        name: dto.name,
        category: dto.category,
        ring: dto.ring ?? null,
        techDescription: dto.techDescription,
        ringDescription: dto.ringDescription ?? null,
        publishedAt: null,
      },
    });
  }

  list(status?: 'draft' | 'published' | 'all') {
    const where =
      status === 'draft'
        ? { publishedAt: null }
        : status === 'published'
          ? { publishedAt: { not: null } }
          : {};
    return this.prisma.technology.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }],
      select: {
        id: true,
        name: true,
        category: true,
        ring: true,
        publishedAt: true,
      },
    });
  }

  find(id: string) {
    return this.prisma.technology.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateTechnologyDto) {
    const current = await this.prisma.technology.findUnique({ where: { id } });
    if (!current) throw new NotFoundException();

    const nextRing = dto.ring ?? current.ring;
    const nextRingDesc = dto.ringDescription ?? current.ringDescription;

    if (current.publishedAt && (!nextRing || !nextRingDesc?.trim())) {
      throw new BadRequestException(
        'Published technologies require ring and description.',
      );
    }
    
    return this.prisma.technology.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.techDescription !== undefined && {
          techDescription: dto.techDescription,
        }),
        ...(dto.ring !== undefined && { ring: dto.ring ?? null }),
        ...(dto.ringDescription !== undefined && {
          ringDescription: dto.ringDescription ?? null,
        }),
      },
    });
  }

  publish(id: string, ring: Ring, ringDescription: string) {
    return this.prisma.technology.update({
      where: { id },
      data: { ring, ringDescription, publishedAt: new Date() },
    });
  }
}
