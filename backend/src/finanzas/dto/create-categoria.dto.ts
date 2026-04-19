import { IsString, IsOptional, IsIn, MaxLength, IsInt } from 'class-validator';

export class CreateCategoriaDto {
  @IsInt()
  iglesiaId: number;

  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsIn(['I', 'E'])
  tipo: string; // 'I' = Ingreso | 'E' = Egreso

  @IsString()
  @IsOptional()
  @MaxLength(200)
  descripcion?: string;
}
