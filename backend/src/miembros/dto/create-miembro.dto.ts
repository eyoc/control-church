import {
  IsString, IsOptional, IsInt, IsBoolean,
  IsEmail, IsDateString, IsIn, MaxLength,
} from 'class-validator';

export class CreateMiembroDto {
  @IsInt()
  iglesiaId: number;

  @IsInt()
  @IsOptional()
  usuarioId?: number;

  @IsInt()
  @IsOptional()
  etapaDiscipuladoId?: number;

  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsString()
  @MaxLength(100)
  apellido: string;

  @IsDateString()
  @IsOptional()
  fechaNacimiento?: string;

  @IsIn(['M', 'F'])
  @IsOptional()
  genero?: string;

  @IsIn(['soltero', 'casado', 'viudo', 'divorciado'])
  @IsOptional()
  estadoCivil?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  fotoUrl?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  telefono?: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  telefonoEmergencia?: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  direccion?: string;

  @IsDateString()
  @IsOptional()
  fechaIngreso?: string;

  @IsDateString()
  @IsOptional()
  fechaBautismo?: string;

  @IsBoolean()
  @IsOptional()
  esBautizado?: boolean;

  @IsString()
  @IsOptional()
  notas?: string;
}
