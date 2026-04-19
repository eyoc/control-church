import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Iglesia } from '../iglesias/iglesia.entity';

@Entity('etapas_discipulado')
export class EtapaDiscipulado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'iglesia_id' })
  iglesiaId: number;

  @Column({ length: 100 })
  nombre: string; // 'Nuevo Creyente', 'Consolidado', 'Discípulo', 'Líder'

  @Column({ length: 300, nullable: true })
  descripcion: string;

  @Column({ default: 1 })
  orden: number;

  @Column({ name: 'color_hex', length: 7, nullable: true })
  colorHex: string; // '#4CAF50'

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => Iglesia)
  @JoinColumn({ name: 'iglesia_id' })
  iglesia: Iglesia;
}
