import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { TechnologiesService } from './technologies.service';
import { PublishTechnologyDto } from './dto/publish-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';

@Controller('technologies')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CTO', 'TECH_LEAD')
export class TechnologiesController {
  constructor(private readonly service: TechnologiesService) {}

  @Post()
  create(@Body() dto: CreateTechnologyDto) {
    return this.service.create(dto);
  }

  @Get()
  list(@Query('status') status?: 'draft' | 'published' | 'all') {
    return this.service.list(status);
  }

  @Get(':id')
  find(@Param('id') id: string) {
    return this.service.find(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTechnologyDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/publish')
  publish(@Param('id') id: string, @Body() dto: PublishTechnologyDto) {
    return this.service.publish(id, dto.ring, dto.ringDescription);
  }

  @Patch(':id/reclassify')
  reclassify(@Param('id') id: string, @Body() dto: PublishTechnologyDto) {
    return this.service.reclassify(id, dto.ring, dto.ringDescription);
  }
}
