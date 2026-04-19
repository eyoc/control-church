import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { Iglesia } from '../iglesias/iglesia.entity';
import { RolUsuario } from './rol-usuario.entity';

@Entity('usuario_iglesia_rol')
export class UsuarioIglesiaRol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'usuario_id' })
  usuarioId: number;

  @Column({ name: 'iglesia_id' })
  iglesiaId: number;

  @Column({ name: 'rol_id' })
  rolId: number;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @ManyToOne(() => Usuario, (u) => u.usuarioIglesiaRoles)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Iglesia)
  @JoinColumn({ name: 'iglesia_id' })
  iglesia: Iglesia;

  @ManyToOne(() => RolUsuario, (r) => r.usuarioIglesiaRoles)
  @JoinColumn({ name: 'rol_id' })
  rol: RolUsuario;
}
