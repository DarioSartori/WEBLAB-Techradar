import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class RadarService {
  constructor(private readonly prisma: PrismaClient) {}

  getPublished() {
    return this.prisma.technology.findMany({
      where: { publishedAt: { not: null } },
      select: { id: true, name: true, category: true, ring: true },
      orderBy: [{ category: 'asc' }, { ring: 'asc' }, { name: 'asc' }],
    });
  }
}
