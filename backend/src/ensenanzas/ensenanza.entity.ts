import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Iglesia } from '../iglesias/iglesia.entity';
import { Miembro } from '../miembros/miembro.entity';

@Entity('enseñanzas')
export class Ensenanza {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'iglesia_id' })
  iglesiaId: number;

  @Column({ name: 'autor_id', nullable: true })
  autorId: number;

  @Column({ length: 200 })
  titulo: string;

  @Column({ length: 500, nullable: true })
  descripcion: string;

  @Column({ length: 30, default: 'sermon' })
  tipo: string; // 'sermon' | 'estudio' | 'material'

  @Column({ type: 'date', nullable: true })
  fecha: string;

  @Column({ name: 'archivo_url', length: 500, nullable: true })
  archivoUrl: string;

  @Column({ name: 'duracion_min', nullable: true })
  duracionMin: number;

  @Column({ length: 300, nullable: true })
  tags: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @ManyToOne(() => Iglesia)
  @JoinColumn({ name: 'iglesia_id' })
  iglesia: Iglesia;

  @ManyToOne(() => Miembro, { nullable: true })
  @JoinColumn({ name: 'autor_id' })
  autor: Miembro;
}
