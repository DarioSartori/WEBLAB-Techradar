import { Injectable, NotFoundException } from '@nestjs/common';
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
        techDescription: dto.techDescription,
        ...(dto.ring !== undefined && { ring: dto.ring ?? null }),
        ...(dto.ringDescription !== undefined && {
          ringDescription: dto.ringDescription ?? null,
        }),
      },
    });
  }

  list(status?: 'draft' | 'published' | 'all') {
    return this.prisma.technology.findMany({
      where: status === 'draft'
        ? { publishedAt: null }
        : status === 'published'
          ? { publishedAt: { not: null } }
          : {},
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
    return this.prisma.technology.findUniqueOrThrow({ where: { id } });
  }

  update(id: string, dto: UpdateTechnologyDto) {
    return this.prisma.technology.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.techDescription !== undefined && {
          techDescription: dto.techDescription,
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

  async reclassify(id: string, ring: Ring, ringDescription: string) {
    const tech = await this.prisma.technology.findUnique({ where: { id } });

    if (!tech) throw new NotFoundException('Technology not found');

    return this.prisma.technology.update({
      where: { id },
      data: { ring, ringDescription },
    });
  }
}
