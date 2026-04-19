import {
  IsInt, IsOptional, IsNumber, IsString,
  IsDateString, IsBoolean, IsIn, MaxLength, Min,
} from 'class-validator';

export class CreateIngresoDto {
  @IsInt()
  iglesiaId: number;

  @IsInt()
  @IsOptional()
  categoriaId?: number;

  @IsInt()
  @IsOptional()
  miembroId?: number; // NULL = anónimo

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  monto: number;

  @IsString()
  @IsOptional()
  @MaxLength(3)
  moneda?: string; // default 'GTQ'

  @IsDateString()
  fecha: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  descripcion?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  comprobanteUrl?: string;

  // Campos fiscales Guatemala
  @IsBoolean()
  @IsOptional()
  emitirRecibo?: boolean;

  @IsIn(['recibo_interno', 'recibo_nit'])
  @IsOptional()
  tipoDocumento?: 'recibo_interno' | 'recibo_nit';

  @IsString()
  @IsOptional()
  @MaxLength(20)
  nitDonante?: string; // 'CF' si es Consumidor Final

  @IsString()
  @IsOptional()
  @MaxLength(200)
  nombreFiscal?: string;
}
