import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Iglesia } from '../iglesias/iglesia.entity';
import { CategoriaFinanciera } from './categoria-financiera.entity';
import { Miembro } from '../miembros/miembro.entity';
import { Usuario } from '../usuarios/usuario.entity';

export type TipoDocumentoEmitido = 'recibo_interno' | 'recibo_nit' | null;

@Entity('finanzas_ingreso')
export class FinanzaIngreso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'iglesia_id' })
  iglesiaId: number;

  @Column({ name: 'categoria_id', nullable: true })
  categoriaId: number;

  @Column({ name: 'miembro_id', nullable: true })
  miembroId: number; // NULL = donante anónimo

  @Column({ name: 'registrado_por' })
  registradoPor: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  monto: number;

  @Column({ length: 3, default: 'GTQ' })
  moneda: string;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ length: 300, nullable: true })
  descripcion: string;

  @Column({ name: 'comprobante_url', length: 500, nullable: true })
  comprobanteUrl: string;

  // Campos fiscales / recibo Guatemala
  @Column({ name: 'numero_recibo', length: 30, nullable: true })
  numeroRecibo: string; // generado por SP: 'IGN-000123'

  @Column({ name: 'nit_donante', length: 20, nullable: true })
  nitDonante: string; // 'CF' = Consumidor Final

  @Column({ name: 'nombre_fiscal', length: 200, nullable: true })
  nombreFiscal: string;

  @Column({ name: 'tipo_documento_emitido', length: 20, nullable: true })
  tipoDocumentoEmitido: TipoDocumentoEmitido;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @ManyToOne(() => Iglesia)
  @JoinColumn({ name: 'iglesia_id' })
  iglesia: Iglesia;

  @ManyToOne(() => CategoriaFinanciera, { nullable: true })
  @JoinColumn({ name: 'categoria_id' })
  categoria: CategoriaFinanciera;

  @ManyToOne(() => Miembro, { nullable: true })
  @JoinColumn({ name: 'miembro_id' })
  miembro: Miembro;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'registrado_por' })
  registrador: Usuario;
}
