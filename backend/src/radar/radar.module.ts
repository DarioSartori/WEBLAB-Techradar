import { Module } from '@nestjs/common';
import { RadarController } from './radar.controller';
import { RadarService } from './radar.service';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [RadarController],
  providers: [
    RadarService,
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
export class RadarModule {}
