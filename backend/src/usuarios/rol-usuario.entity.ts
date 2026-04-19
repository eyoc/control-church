import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany,
} from 'typeorm';
import { UsuarioIglesiaRol } from './usuario-iglesia-rol.entity';

@Entity('roles_usuario')
export class RolUsuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60, unique: true })
  nombre: string; // 'superadmin' | 'pastor' | 'administrador' | 'lider_grupo' | 'miembro'

  @Column({ length: 200, nullable: true })
  descripcion: string;

  @Column({ default: 10 })
  nivel: number; // 1=SuperAdmin ... 10=básico

  @OneToMany(() => UsuarioIglesiaRol, (uir) => uir.rol)
  usuarioIglesiaRoles: UsuarioIglesiaRol[];
}
