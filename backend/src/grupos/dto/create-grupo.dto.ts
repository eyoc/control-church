import {
  IsString, IsOptional, IsInt, IsIn, MaxLength,
} from 'class-validator';

export class CreateGrupoDto {
  @IsInt()
  iglesiaId: number;

  @IsInt()
  @IsOptional()
  liderId?: number;

  @IsString()
  @MaxLength(150)
  nombre: string;

  @IsIn(['celula', 'departamento', 'ministerio'])
  @IsOptional()
  tipo?: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  descripcion?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  lugarReunion?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  diaReunion?: string;

  @IsString()
  @IsOptional()
  horaReunion?: string; // 'HH:MM:SS'
}
