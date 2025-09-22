import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Category } from './category.enum';
import { Ring } from './ring.enum';
import { Transform } from 'class-transformer';

export class CreateTechnologyDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(Category)
  @IsNotEmpty()
  category!: Category;

  @IsOptional()
  @IsEnum(Ring)
  @Transform(({ value }) => (value === '' ? undefined : value))
  ring?: Ring;

  @IsString()
  @IsNotEmpty()
  techDescription!: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  ringDescription?: string;
}
