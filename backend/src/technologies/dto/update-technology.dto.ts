import { PartialType } from '@nestjs/mapped-types';
import { CreateTechnologyDto } from './create-technology.dto';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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
}
