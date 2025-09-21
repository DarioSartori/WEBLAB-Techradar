import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Ring } from './ring.enum';

export class PublishTechnologyDto {
  @IsEnum(Ring)
  @IsNotEmpty()
  ring!: Ring;

  @IsString()
  @IsNotEmpty()
  ringDescription!: string;
}
