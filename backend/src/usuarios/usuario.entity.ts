import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import { UsuarioIglesiaRol } from './usuario-iglesia-rol.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ length: 60, nullable: true })
  nickname: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100, nullable: true })
  apellido: string;

  @Column({ name: 'google_id', length: 100, nullable: true, unique: true })
  googleId: string;

  @Column({ name: 'password_hash', length: 255, nullable: true, select: false })
  passwordHash: string;

  @Column({ name: 'foto_url', length: 500, nullable: true })
  fotoUrl: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  @OneToMany(() => UsuarioIglesiaRol, (uir) => uir.usuario)
  usuarioIglesiaRoles: UsuarioIglesiaRol[];
}
