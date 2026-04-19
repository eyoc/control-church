import { IsInt, IsOptional, IsDateString, IsString } from 'class-validator';

export class RegistrarAvanceDiscipuladoDto {
  @IsInt()
  etapaDiscipuladoId: number;

  @IsInt()
  @IsOptional()
  mentorUsuarioId?: number;

  @IsDateString()
  fechaInicio: string;

  @IsString()
  @IsOptional()
  notas?: string;
}
