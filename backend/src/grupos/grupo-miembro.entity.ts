import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Grupo } from './grupo.entity';
import { Miembro } from '../miembros/miembro.entity';

@Entity('grupo_miembro')
export class GrupoMiembro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'grupo_id' })
  grupoId: number;

  @Column({ name: 'miembro_id' })
  miembroId: number;

  @Column({ name: 'fecha_ingreso', type: 'date' })
  fechaIngreso: string;

  @Column({ name: 'fecha_salida', type: 'date', nullable: true })
  fechaSalida: string;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => Grupo)
  @JoinColumn({ name: 'grupo_id' })
  grupo: Grupo;

  @ManyToOne(() => Miembro)
  @JoinColumn({ name: 'miembro_id' })
  miembro: Miembro;
}
