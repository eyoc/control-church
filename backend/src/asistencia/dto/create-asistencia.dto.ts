import {
  IsString, IsOptional, IsInt, IsDateString, IsIn,
  IsArray, ValidateNested, IsBoolean, MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DetalleAsistenciaDto {
  @IsInt()
  miembroId: number;

  @IsBoolean()
  @IsOptional()
  presente?: boolean;

  @IsBoolean()
  @IsOptional()
  justificado?: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  notas?: string;
}

export class CreateAsistenciaDto {
  @IsInt()
  iglesiaId: number;

  @IsInt()
  @IsOptional()
  grupoId?: number;

  @IsIn(['servicio', 'celula', 'evento'])
  @IsOptional()
  tipo?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  titulo?: string;

  @IsDateString()
  fecha: string;

  @IsString()
  @IsOptional()
  horaInicio?: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  notas?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleAsistenciaDto)
  detalle: DetalleAsistenciaDto[];
}
