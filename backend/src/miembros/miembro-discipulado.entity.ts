import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Miembro } from './miembro.entity';
import { Usuario } from '../usuarios/usuario.entity';
import { EtapaDiscipulado } from './etapa-discipulado.entity';

@Entity('miembro_discipulado')
export class MiembroDiscipulado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'miembro_id' })
  miembroId: number;

  @Column({ name: 'mentor_usuario_id', nullable: true })
  mentorUsuarioId: number;

  @Column({ name: 'etapa_discipulado_id' })
  etapaDiscipuladoId: number;

  @Column({ name: 'fecha_inicio', type: 'date' })
  fechaInicio: string;

  @Column({ name: 'fecha_fin', type: 'date', nullable: true })
  fechaFin: string; // NULL = etapa actual

  @Column({ type: 'nvarchar', length: 'max', nullable: true })
  notas: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @ManyToOne(() => Miembro)
  @JoinColumn({ name: 'miembro_id' })
  miembro: Miembro;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'mentor_usuario_id' })
  mentor: Usuario;

  @ManyToOne(() => EtapaDiscipulado)
  @JoinColumn({ name: 'etapa_discipulado_id' })
  etapaDiscipulado: EtapaDiscipulado;
}
