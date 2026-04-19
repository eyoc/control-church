import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Iglesia } from '../iglesias/iglesia.entity';
import { Miembro } from '../miembros/miembro.entity';

@Entity('grupos')
export class Grupo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'iglesia_id' })
  iglesiaId: number;

  @Column({ name: 'lider_id', nullable: true })
  liderId: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ length: 50, default: 'celula' })
  tipo: string; // 'celula' | 'departamento' | 'ministerio'

  @Column({ length: 300, nullable: true })
  descripcion: string;

  @Column({ name: 'lugar_reunion', length: 200, nullable: true })
  lugarReunion: string;

  @Column({ name: 'dia_reunion', length: 20, nullable: true })
  diaReunion: string; // 'lunes' | 'martes' | ...

  @Column({ name: 'hora_reunion', type: 'time', nullable: true })
  horaReunion: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  @ManyToOne(() => Iglesia)
  @JoinColumn({ name: 'iglesia_id' })
  iglesia: Iglesia;

  @ManyToOne(() => Miembro, { nullable: true })
  @JoinColumn({ name: 'lider_id' })
  lider: Miembro;
}
