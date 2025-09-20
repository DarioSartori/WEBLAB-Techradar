import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { TechnologiesService } from './technologies.service';
import { CreateTechnologyDto } from './dto/create-technology.dto';

@Controller('technologies')
export class TechnologiesController {
  constructor(private readonly service: TechnologiesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateTechnologyDto) {
    return this.service.create(dto);
  }
}
