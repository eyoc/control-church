import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Iglesia } from '../iglesias/iglesia.entity';
import { CategoriaFinanciera } from './categoria-financiera.entity';
import { Usuario } from '../usuarios/usuario.entity';

@Entity('finanzas_egreso')
export class FinanzaEgreso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'iglesia_id' })
  iglesiaId: number;

  @Column({ name: 'categoria_id', nullable: true })
  categoriaId: number;

  @Column({ name: 'registrado_por' })
  registradoPor: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  monto: number;

  @Column({ length: 3, default: 'GTQ' })
  moneda: string;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ length: 300 })
  descripcion: string;

  @Column({ length: 150, nullable: true })
  beneficiario: string;

  @Column({ name: 'comprobante_url', length: 500, nullable: true })
  comprobanteUrl: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @ManyToOne(() => Iglesia)
  @JoinColumn({ name: 'iglesia_id' })
  iglesia: Iglesia;

  @ManyToOne(() => CategoriaFinanciera, { nullable: true })
  @JoinColumn({ name: 'categoria_id' })
  categoria: CategoriaFinanciera;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'registrado_por' })
  registrador: Usuario;
}
