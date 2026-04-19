import {
  IsInt, IsOptional, IsNumber, IsString,
  IsDateString, MaxLength, Min,
} from 'class-validator';

export class CreateEgresoDto {
  @IsInt()
  iglesiaId: number;

  @IsInt()
  @IsOptional()
  categoriaId?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  monto: number;

  @IsString()
  @IsOptional()
  @MaxLength(3)
  moneda?: string;

  @IsDateString()
  fecha: string;

  @IsString()
  @MaxLength(300)
  descripcion: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  beneficiario?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  comprobanteUrl?: string;
}
