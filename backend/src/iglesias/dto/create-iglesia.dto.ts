import {
  IsString, IsOptional, IsInt, IsBoolean, MaxLength, IsIn,
} from 'class-validator';

export class CreateIglesiaDto {
  @IsInt()
  organizacionId: number;

  @IsInt()
  @IsOptional()
  iglesiaPadreId?: number;

  @IsString()
  @MaxLength(150)
  nombre: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  direccion?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  ciudad?: string;

  @IsString()
  @IsOptional()
  @MaxLength(80)
  pais?: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  telefono?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  logoUrl?: string;

  // Campos fiscales Guatemala
  @IsString()
  @IsOptional()
  @MaxLength(20)
  nit?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  razonSocialFiscal?: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  direccionFiscal?: string;

  @IsString()
  @IsOptional()
  @MaxLength(60)
  regimenFiscal?: string;

  @IsBoolean()
  @IsOptional()
  esEmisorFacturas?: boolean;

  @IsIn(['recibo_interno', 'recibo_nit', 'ambos'])
  @IsOptional()
  tipoDocumento?: string;

  @IsString()
  @IsOptional()
  @MaxLength(15)
  prefijoRecibo?: string;
}
