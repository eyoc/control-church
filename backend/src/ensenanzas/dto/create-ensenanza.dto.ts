import {
  IsString, IsOptional, IsInt, IsDateString, IsIn, MaxLength,
} from 'class-validator';

export class CreateEnsenanzaDto {
  @IsInt()
  iglesiaId: number;

  @IsInt()
  @IsOptional()
  autorId?: number;

  @IsString()
  @MaxLength(200)
  titulo: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  descripcion?: string;

  @IsIn(['sermon', 'estudio', 'material'])
  @IsOptional()
  tipo?: string;

  @IsDateString()
  @IsOptional()
  fecha?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  archivoUrl?: string;

  @IsInt()
  @IsOptional()
  duracionMin?: number;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  tags?: string;
}
