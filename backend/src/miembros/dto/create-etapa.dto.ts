import { IsString, IsOptional, IsInt, MaxLength } from 'class-validator';

export class CreateEtapaDto {
  @IsInt()
  iglesiaId: number;

  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  descripcion?: string;

  @IsInt()
  @IsOptional()
  orden?: number;

  @IsString()
  @IsOptional()
  @MaxLength(7)
  colorHex?: string; // '#4CAF50'
}
