// ============================================================
// Control-Church — Entidades actualizadas con campos fiscales
// Aplica sobre: organizacion.entity.ts, iglesia.entity.ts,
//               finanza-ingreso.entity.ts
// ============================================================

// ─────────────────────────────────────────────
// src/organizaciones/organizacion.entity.ts  (reemplazar completo)
// ─────────────────────────────────────────────
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

  // ── Campos fiscales Guatemala ──────────────────
  @Column({ length: 20, nullable: true })
  nit: string;                    // ej: '1234567-8'

  @Column({ name: 'razon_social_fiscal', length: 200, nullable: true })
  razonSocialFiscal: string;      // nombre registrado en SAT

  @Column({ name: 'direccion_fiscal', length: 300, nullable: true })
  direccionFiscal: string;

  @Column({ name: 'regimen_fiscal', length: 60, nullable: true })
  regimenFiscal: string;          // 'Pequeño Contribuyente' | 'General IVA' | 'Exento'
  // ────────────────────────────────────────────────

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  @OneToMany(() => Iglesia, (iglesia) => iglesia.organizacion)
  iglesias: Iglesia[];
}


// ─────────────────────────────────────────────
// src/iglesias/iglesia.entity.ts  (reemplazar completo)
// ─────────────────────────────────────────────
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

  // ── Campos fiscales Guatemala ──────────────────
  @Column({ length: 20, nullable: true })
  nit: string;                    // NIT propio de esta iglesia/sucursal

  @Column({ name: 'razon_social_fiscal', length: 200, nullable: true })
  razonSocialFiscal: string;

  @Column({ name: 'direccion_fiscal', length: 300, nullable: true })
  direccionFiscal: string;

  @Column({ name: 'regimen_fiscal', length: 60, nullable: true })
  regimenFiscal: string;          // 'Pequeño Contribuyente' | 'General IVA' | 'Exento'

  @Column({ name: 'es_emisor_facturas', default: false })
  esEmisorFacturas: boolean;      // false → usa el NIT de la organización madre

  @Column({
    name: 'tipo_documento',
    length: 20,
    default: 'recibo_interno',
  })
  tipoDocumento: TipoDocumentoIglesia;  // 'recibo_interno' | 'recibo_nit' | 'ambos'

  @Column({ name: 'prefijo_recibo', length: 15, nullable: true })
  prefijoRecibo: string;          // ej: 'IGN-', 'IGL-SUR-'

  @Column({ name: 'correlativo_recibo', default: 0 })
  correlativoRecibo: number;      // SOLO leer. Nunca modificar directo — usar el SP
  // ────────────────────────────────────────────────

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


// ─────────────────────────────────────────────
// src/finanzas/finanza-ingreso.entity.ts  (reemplazar completo)
// ─────────────────────────────────────────────
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
  miembroId: number;              // NULL = donante anónimo

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

  // ── Campos fiscales / recibo ───────────────────
  @Column({ name: 'numero_recibo', length: 30, nullable: true, unique: false })
  numeroRecibo: string;           // generado por SP: 'IGN-000123'

  @Column({ name: 'nit_donante', length: 20, nullable: true })
  nitDonante: string;             // 'CF' si es consumidor final

  @Column({ name: 'nombre_fiscal', length: 200, nullable: true })
  nombreFiscal: string;           // nombre fiscal del donante

  @Column({
    name: 'tipo_documento_emitido',
    length: 20,
    nullable: true,
  })
  tipoDocumentoEmitido: TipoDocumentoEmitido;  // null = sin documento
  // ────────────────────────────────────────────────

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


// ─────────────────────────────────────────────
// src/finanzas/finanzas.service.ts  (fragmento relevante)
// Cómo llamar al SP desde NestJS
// ─────────────────────────────────────────────
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class FinanzasService {
  constructor(private dataSource: DataSource) {}

  /**
   * Genera el siguiente número de recibo para una iglesia.
   * Llama al SP que maneja el correlativo con bloqueo de fila.
   * NUNCA incrementar correlativo_recibo directamente.
   */
  async generarNumeroRecibo(iglesiaId: number): Promise<string> {
    const result = await this.dataSource.query(
      `DECLARE @numero NVARCHAR(30);
       EXEC sp_siguiente_correlativo_recibo @iglesia_id = @0, @numero_recibo = @numero OUTPUT;
       SELECT @numero AS numero_recibo;`,
      [iglesiaId],
    );
    return result[0]?.numero_recibo as string;
  }

  /**
   * Registra un ingreso y opcionalmente emite recibo.
   * Si la iglesia tiene tipo_documento != 'recibo_interno',
   * el nit_donante es requerido (usar 'CF' si no aplica).
   */
  async registrarIngreso(dto: {
    iglesiaId: number;
    miembroId?: number;
    categoriaId?: number;
    registradoPor: number;
    monto: number;
    fecha: string;
    descripcion?: string;
    emitirRecibo: boolean;
    tipoDocumento?: 'recibo_interno' | 'recibo_nit';
    nitDonante?: string;      // obligatorio si tipoDocumento = 'recibo_nit'
    nombreFiscal?: string;
  }) {
    let numeroRecibo: string | null = null;

    if (dto.emitirRecibo) {
      numeroRecibo = await this.generarNumeroRecibo(dto.iglesiaId);
    }

    // NIT por defecto = 'CF' (Consumidor Final Guatemala)
    const nitDonante = dto.nitDonante?.trim() || 'CF';

    return this.dataSource
      .getRepository('finanzas_ingreso')
      .save({
        iglesiaId: dto.iglesiaId,
        miembroId: dto.miembroId ?? null,
        categoriaId: dto.categoriaId ?? null,
        registradoPor: dto.registradoPor,
        monto: dto.monto,
        moneda: 'GTQ',
        fecha: dto.fecha,
        descripcion: dto.descripcion ?? null,
        numeroRecibo,
        nitDonante: dto.emitirRecibo ? nitDonante : null,
        nombreFiscal: dto.nombreFiscal ?? null,
        tipoDocumentoEmitido: dto.emitirRecibo ? dto.tipoDocumento : null,
      });
  }
}
