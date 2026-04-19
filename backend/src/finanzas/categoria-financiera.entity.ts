import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Iglesia } from '../iglesias/iglesia.entity';

@Entity('categorias_financieras')
export class CategoriaFinanciera {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'iglesia_id' })
  iglesiaId: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 1 })
  tipo: string; // 'I' = Ingreso | 'E' = Egreso

  @Column({ length: 200, nullable: true })
  descripcion: string;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => Iglesia)
  @JoinColumn({ name: 'iglesia_id' })
  iglesia: Iglesia;
}
