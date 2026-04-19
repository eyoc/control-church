import { IsInt, IsDateString } from 'class-validator';

export class AgregarMiembroDto {
  @IsInt()
  miembroId: number;

  @IsDateString()
  fechaIngreso: string;
}
