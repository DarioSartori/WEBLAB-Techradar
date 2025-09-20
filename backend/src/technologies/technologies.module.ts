import { Module } from '@nestjs/common';
import { TechnologiesController } from './technologies.controller';
import { TechnologiesService } from './technologies.service';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [TechnologiesController],
  providers: [
    TechnologiesService,
    {
      provide: PrismaClient,
      useFactory: async () => {
        const { PrismaClient } = await import('@prisma/client');
        const client = new PrismaClient();
        return client;
      },
    },
  ],
})
export class TechnologiesModule {}
