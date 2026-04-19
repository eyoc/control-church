import { IsEmail, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  apellido?: string;

  @IsString()
  @IsOptional()
  @MaxLength(60)
  nickname?: string;
}
