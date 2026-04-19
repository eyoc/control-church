import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Asistencia } from './asistencia.entity';
import { Miembro } from '../miembros/miembro.entity';

@Entity('asistencia_detalle')
export class AsistenciaDetalle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'asistencia_id' })
  asistenciaId: number;

  @Column({ name: 'miembro_id' })
  miembroId: number;

  @Column({ default: true })
  presente: boolean;

  @Column({ default: false })
  justificado: boolean;

  @Column({ length: 200, nullable: true })
  notas: string;

  @ManyToOne(() => Asistencia, (a) => a.detalle)
  @JoinColumn({ name: 'asistencia_id' })
  asistencia: Asistencia;

  @ManyToOne(() => Miembro)
  @JoinColumn({ name: 'miembro_id' })
  miembro: Miembro;
}
