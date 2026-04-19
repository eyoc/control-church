import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateOrganizacionDto {
  @IsString()
  @MaxLength(150)
  nombre: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  descripcion?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  logoUrl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  sitioWeb?: string;

  @IsString()
  @IsOptional()
  @MaxLength(80)
  pais?: string;

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
}
