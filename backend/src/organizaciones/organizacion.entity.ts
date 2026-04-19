import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import { Iglesia } from '../iglesias/iglesia.entity';

@Entity('organizaciones')
export class Organizacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ length: 500, nullable: true })
  descripcion: string;

  @Column({ name: 'logo_url', length: 500, nullable: true })
  logoUrl: string;

  @Column({ name: 'sitio_web', length: 200, nullable: true })
  sitioWeb: string;

  @Column({ length: 80, default: 'Guatemala' })
  pais: string;

  // Campos fiscales Guatemala / SAT
  @Column({ length: 20, nullable: true })
  nit: string;

  @Column({ name: 'razon_social_fiscal', length: 200, nullable: true })
  razonSocialFiscal: string;

  @Column({ name: 'direccion_fiscal', length: 300, nullable: true })
  direccionFiscal: string;

  @Column({ name: 'regimen_fiscal', length: 60, nullable: true })
  regimenFiscal: string; // 'Pequeño Contribuyente' | 'General IVA' | 'Exento'

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  @OneToMany(() => Iglesia, (iglesia) => iglesia.organizacion)
  iglesias: Iglesia[];
}
