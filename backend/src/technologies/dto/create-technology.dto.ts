import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Category } from './category.enum';
import { Ring } from './ring.enum';

export class CreateTechnologyDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(Category)
  @IsNotEmpty()
  category!: Category;

  @IsEnum(Ring)
  @IsNotEmpty()
  ring!: Ring;

  @IsString()
  @IsNotEmpty()
  techDescription!: string;

  @IsString()
  @IsNotEmpty()
  ringDescription!: string;
}
