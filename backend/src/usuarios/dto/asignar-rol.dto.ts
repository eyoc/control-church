import { IsInt } from 'class-validator';

export class AsignarRolDto {
  @IsInt()
  iglesiaId: number;

  @IsInt()
  rolId: number;
}
