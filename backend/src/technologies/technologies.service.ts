import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { CreateTechnologyDto } from "./dto/create-technology.dto";

@Injectable()
export class TechnologiesService {
  constructor(private readonly prisma: PrismaClient) {}

  create(dto: CreateTechnologyDto) {
    return this.prisma.technology.create({
      data: {
        name: dto.name,
        category: dto.category,
        ring: dto.ring,
        techDescription: dto.techDescription,
        ringDescription: dto.ringDescription,
      },
    });
  }
}