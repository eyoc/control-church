import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { Organizacion } from '../organizaciones/organizacion.entity';

export type TipoDocumentoIglesia = 'recibo_interno' | 'recibo_nit' | 'ambos';

@Entity('iglesias')
export class Iglesia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'organizacion_id' })
  organizacionId: number;

  @Column({ name: 'iglesia_padre_id', nullable: true })
  iglesiaPadreId: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ length: 300, nullable: true })
  direccion: string;

  @Column({ length: 100, nullable: true })
  ciudad: string;

  @Column({ length: 80, default: 'Guatemala' })
  pais: string;

  @Column({ length: 30, nullable: true })
  telefono: string;

  @Column({ length: 150, nullable: true })
  email: string;

  @Column({ name: 'logo_url', length: 500, nullable: true })
  logoUrl: string;

  // Campos fiscales Guatemala / SAT
  @Column({ length: 20, nullable: true })
  nit: string;

  @Column({ name: 'razon_social_fiscal', length: 200, nullable: true })
  razonSocialFiscal: string;

  @Column({ name: 'direccion_fiscal', length: 300, nullable: true })
  direccionFiscal: string;

  @Column({ name: 'regimen_fiscal', length: 60, nullable: true })
  regimenFiscal: string;

  @Column({ name: 'es_emisor_facturas', default: false })
  esEmisorFacturas: boolean;

  @Column({ name: 'tipo_documento', length: 20, default: 'recibo_interno' })
  tipoDocumento: TipoDocumentoIglesia;

  @Column({ name: 'prefijo_recibo', length: 15, nullable: true })
  prefijoRecibo: string;

  @Column({ name: 'correlativo_recibo', default: 0 })
  correlativoRecibo: number; // Solo lectura — usar sp_siguiente_correlativo_recibo

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  @ManyToOne(() => Organizacion, (org) => org.iglesias)
  @JoinColumn({ name: 'organizacion_id' })
  organizacion: Organizacion;

  @ManyToOne(() => Iglesia, (i) => i.sucursales, { nullable: true })
  @JoinColumn({ name: 'iglesia_padre_id' })
  iglesiaPadre: Iglesia;

  @OneToMany(() => Iglesia, (i) => i.iglesiaPadre)
  sucursales: Iglesia[];
}
