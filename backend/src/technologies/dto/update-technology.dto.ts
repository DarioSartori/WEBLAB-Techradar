import { PartialType } from '@nestjs/mapped-types';
import { CreateTechnologyDto } from './create-technology.dto';
import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateTechnologyDto extends PartialType(CreateTechnologyDto) {
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  ringDescription?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  ring?: any;
}
