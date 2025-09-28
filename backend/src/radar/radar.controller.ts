import { Controller, Get, UseGuards } from '@nestjs/common';
import { RadarService } from './radar.service';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';

@Controller('radar')
@UseGuards(JwtAuthGuard)
export class RadarController {
  constructor(private readonly service: RadarService) {}

  @Get()
  getPublished() {
    return this.service.getPublished();
  }
}
