import { Controller, Get } from '@nestjs/common';
import { RadarService } from './radar.service';

@Controller('radar')
export class RadarController {
  constructor(private readonly service: RadarService) {}

  @Get()
  getPublished() {
    return this.service.getPublished();
  }
}
