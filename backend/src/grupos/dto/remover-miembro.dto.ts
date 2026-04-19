import { IsDateString } from 'class-validator';

export class RemoverMiembroDto {
  @IsDateString()
  fechaSalida: string;
}
