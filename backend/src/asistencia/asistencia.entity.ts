import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { Iglesia } from '../iglesias/iglesia.entity';
import { Grupo } from '../grupos/grupo.entity';
import { Usuario } from '../usuarios/usuario.entity';
import { AsistenciaDetalle } from './asistencia-detalle.entity';

@Entity('asistencia')
export class Asistencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'iglesia_id' })
  iglesiaId: number;

  @Column({ name: 'grupo_id', nullable: true })
  grupoId: number; // NULL = servicio general

  @Column({ length: 50, default: 'servicio' })
  tipo: string; // 'servicio' | 'celula' | 'evento'

  @Column({ length: 150, nullable: true })
  titulo: string;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ name: 'hora_inicio', type: 'time', nullable: true })
  horaInicio: string;

  @Column({ name: 'registrado_por' })
  registradoPor: number;

  @Column({ length: 300, nullable: true })
  notas: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @ManyToOne(() => Iglesia)
  @JoinColumn({ name: 'iglesia_id' })
  iglesia: Iglesia;

  @ManyToOne(() => Grupo, { nullable: true })
  @JoinColumn({ name: 'grupo_id' })
  grupo: Grupo;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'registrado_por' })
  registrador: Usuario;

  @OneToMany(() => AsistenciaDetalle, (d) => d.asistencia, { cascade: true })
  detalle: AsistenciaDetalle[];
}
