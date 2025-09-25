import { PartialType } from '@nestjs/mapped-types';
import { CreateTechnologyDto } from './create-technology.dto';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { Category } from './category.enum';

export class UpdateTechnologyDto extends PartialType(CreateTechnologyDto) {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  techDescription?: string;
  
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  ringDescription?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  ring?: any;
}
