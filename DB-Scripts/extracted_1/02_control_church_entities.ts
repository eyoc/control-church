// ============================================================
// Control-Church — Entidades TypeORM
// IMPORTANTE: synchronize: false en TypeORM. Las tablas se
// crean con el script SQL. Estas entidades son solo mapeo.
// ============================================================

// ─────────────────────────────────────────────
// src/organizaciones/organizacion.entity.ts
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
// src/iglesias/iglesia.entity.ts
// ─────────────────────────────────────────────
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { Organizacion } from '../organizaciones/organizacion.entity';

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
// src/usuarios/rol-usuario.entity.ts
// ─────────────────────────────────────────────
import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany,
} from 'typeorm';
import { UsuarioIglesiaRol } from './usuario-iglesia-rol.entity';

@Entity('roles_usuario')
export class RolUsuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60, unique: true })
  nombre: string;

  @Column({ length: 200, nullable: true })
  descripcion: string;

  @Column({ default: 10 })
  nivel: number;

  @OneToMany(() => UsuarioIglesiaRol, (uir) => uir.rol)
  usuarioIglesiaRoles: UsuarioIglesiaRol[];
}


// ─────────────────────────────────────────────
// src/usuarios/usuario.entity.ts
// ─────────────────────────────────────────────
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import { UsuarioIglesiaRol } from './usuario-iglesia-rol.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ length: 60, nullable: true })
  nickname: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100, nullable: true })
  apellido: string;

  @Column({ name: 'google_id', length: 100, nullable: true, unique: true })
  googleId: string;

  @Column({ name: 'password_hash', length: 255, nullable: true, select: false })
  passwordHash: string;  // select: false → no se devuelve en queries normales

  @Column({ name: 'foto_url', length: 500, nullable: true })
  fotoUrl: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  @OneToMany(() => UsuarioIglesiaRol, (uir) => uir.usuario)
  usuarioIglesiaRoles: UsuarioIglesiaRol[];
}


// ─────────────────────────────────────────────
// src/usuarios/usuario-iglesia-rol.entity.ts
// ─────────────────────────────────────────────
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { Iglesia } from '../iglesias/iglesia.entity';
import { RolUsuario } from './rol-usuario.entity';

@Entity('usuario_iglesia_rol')
export class UsuarioIglesiaRol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'usuario_id' })
  usuarioId: number;

  @Column({ name: 'iglesia_id' })
  iglesiaId: number;

  @Column({ name: 'rol_id' })
  rolId: number;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @ManyToOne(() => Usuario, (u) => u.usuarioIglesiaRoles)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Iglesia)
  @JoinColumn({ name: 'iglesia_id' })
  iglesia: Iglesia;

  @ManyToOne(() => RolUsuario, (r) => r.usuarioIglesiaRoles)
  @JoinColumn({ name: 'rol_id' })
  rol: RolUsuario;
}


// ─────────────────────────────────────────────
// src/miembros/etapa-discipulado.entity.ts
// ─────────────────────────────────────────────
import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, OneToMany,
} from 'typeorm';
import { Iglesia } from '../iglesias/iglesia.entity';

@Entity('etapas_discipulado')
export class EtapaDiscipulado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'iglesia_id' })
  iglesiaId: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 300, nullable: true })
  descripcion: string;

  @Column({ default: 1 })
  orden: number;

  @Column({ name: 'color_hex', length: 7, nullable: true })
  colorHex: string;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => Iglesia)
  @JoinColumn({ name: 'iglesia_id' })
  iglesia: Iglesia;
}


// ─────────────────────────────────────────────
// src/miembros/miembro.entity.ts
// ─────────────────────────────────────────────
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Iglesia } from '../iglesias/iglesia.entity';
import { Usuario } from '../usuarios/usuario.entity';
import { EtapaDiscipulado } from './etapa-discipulado.entity';

@Entity('miembros')
export class Miembro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'iglesia_id' })
  iglesiaId: number;

  @Column({ name: 'usuario_id', nullable: true })
  usuarioId: number;

  @Column({ name: 'etapa_discipulado_id', nullable: true })
  etapaDiscipuladoId: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellido: string;

  @Column({ name: 'fecha_nacimiento', type: 'date', nullable: true })
  fechaNacimiento: string;

  @Column({ length: 1, nullable: true })
  genero: string;  // 'M' | 'F'

  @Column({ name: 'estado_civil', length: 20, nullable: true })
  estadoCivil: string;

  @Column({ name: 'foto_url', length: 500, nullable: true })
  fotoUrl: string;

  @Column({ length: 150, nullable: true })
  email: string;

  @Column({ length: 30, nullable: true })
  telefono: string;

  @Column({ name: 'telefono_emergencia', length: 30, nullable: true })
  telefonoEmergencia: string;

  @Column({ length: 300, nullable: true })
  direccion: string;

  @Column({ name: 'fecha_ingreso', type: 'date', nullable: true })
  fechaIngreso: string;

  @Column({ name: 'fecha_bautismo', type: 'date', nullable: true })
  fechaBautismo: string;

  @Column({ name: 'es_bautizado', default: false })
  esBautizado: boolean;

  @Column({ name: 'es_activo', default: true })
  esActivo: boolean;

  @Column({ type: 'nvarchar', length: 'max', nullable: true })
  notas: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  @ManyToOne(() => Iglesia)
  @JoinColumn({ name: 'iglesia_id' })
  iglesia: Iglesia;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => EtapaDiscipulado, { nullable: true })
  @JoinColumn({ name: 'etapa_discipulado_id' })
  etapaDiscipulado: EtapaDiscipulado;
}


// ─────────────────────────────────────────────
// src/miembros/miembro-discipulado.entity.ts
// ─────────────────────────────────────────────
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
  fechaFin: string;  // NULL = etapa actual

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


// ─────────────────────────────────────────────
// src/grupos/grupo.entity.ts
// ─────────────────────────────────────────────
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
  tipo: string;  // 'celula' | 'departamento' | 'ministerio'

  @Column({ length: 300, nullable: true })
  descripcion: string;

  @Column({ name: 'lugar_reunion', length: 200, nullable: true })
  lugarReunion: string;

  @Column({ name: 'dia_reunion', length: 20, nullable: true })
  diaReunion: string;

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


// ─────────────────────────────────────────────
// src/grupos/grupo-miembro.entity.ts
// ─────────────────────────────────────────────
import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Grupo } from './grupo.entity';
import { Miembro } from '../miembros/miembro.entity';

@Entity('grupo_miembro')
export class GrupoMiembro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'grupo_id' })
  grupoId: number;

  @Column({ name: 'miembro_id' })
  miembroId: number;

  @Column({ name: 'fecha_ingreso', type: 'date' })
  fechaIngreso: string;

  @Column({ name: 'fecha_salida', type: 'date', nullable: true })
  fechaSalida: string;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => Grupo)
  @JoinColumn({ name: 'grupo_id' })
  grupo: Grupo;

  @ManyToOne(() => Miembro)
  @JoinColumn({ name: 'miembro_id' })
  miembro: Miembro;
}


// ─────────────────────────────────────────────
// src/asistencia/asistencia.entity.ts
// ─────────────────────────────────────────────
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { Iglesia } from '../iglesias/iglesia.entity';
import { Grupo } from '../grupos/grupo.entity';
import { Usuario } from '../usuarios/usuario.entity';
import { AsistenciaDetalle } from './asistencia-detalle.entity';

@Entity('asistencia')
export class Asistencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'iglesia_id' })
  iglesiaId: number;

  @Column({ name: 'grupo_id', nullable: true })
  grupoId: number;  // NULL = servicio general

  @Column({ length: 50, default: 'servicio' })
  tipo: string;  // 'servicio' | 'celula' | 'evento'

  @Column({ length: 150, nullable: true })
  titulo: string;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ name: 'hora_inicio', type: 'time', nullable: true })
  horaInicio: string;

  @Column({ name: 'registrado_por' })
  registradoPor: number;

  @Column({ length: 300, nullable: true })
  notas: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @ManyToOne(() => Iglesia)
  @JoinColumn({ name: 'iglesia_id' })
  iglesia: Iglesia;

  @ManyToOne(() => Grupo, { nullable: true })
  @JoinColumn({ name: 'grupo_id' })
  grupo: Grupo;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'registrado_por' })
  registrador: Usuario;

  @OneToMany(() => AsistenciaDetalle, (d) => d.asistencia, { cascade: true })
  detalle: AsistenciaDetalle[];
}


// ─────────────────────────────────────────────
// src/asistencia/asistencia-detalle.entity.ts
// ─────────────────────────────────────────────
import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Asistencia } from './asistencia.entity';
import { Miembro } from '../miembros/miembro.entity';

@Entity('asistencia_detalle')
export class AsistenciaDetalle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'asistencia_id' })
  asistenciaId: number;

  @Column({ name: 'miembro_id' })
  miembroId: number;

  @Column({ default: true })
  presente: boolean;

  @Column({ default: false })
  justificado: boolean;

  @Column({ length: 200, nullable: true })
  notas: string;

  @ManyToOne(() => Asistencia, (a) => a.detalle)
  @JoinColumn({ name: 'asistencia_id' })
  asistencia: Asistencia;

  @ManyToOne(() => Miembro)
  @JoinColumn({ name: 'miembro_id' })
  miembro: Miembro;
}


// ─────────────────────────────────────────────
// src/ensenanzas/ensenanza.entity.ts
// ─────────────────────────────────────────────
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
  tipo: string;  // 'sermon' | 'estudio' | 'material'

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


// ─────────────────────────────────────────────
// src/finanzas/categoria-financiera.entity.ts
// ─────────────────────────────────────────────
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
  tipo: string;  // 'I' | 'E'

  @Column({ length: 200, nullable: true })
  descripcion: string;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => Iglesia)
  @JoinColumn({ name: 'iglesia_id' })
  iglesia: Iglesia;
}


// ─────────────────────────────────────────────
// src/finanzas/finanza-ingreso.entity.ts
// ─────────────────────────────────────────────
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Iglesia } from '../iglesias/iglesia.entity';
import { CategoriaFinanciera } from './categoria-financiera.entity';
import { Miembro } from '../miembros/miembro.entity';
import { Usuario } from '../usuarios/usuario.entity';

@Entity('finanzas_ingreso')
export class FinanzaIngreso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'iglesia_id' })
  iglesiaId: number;

  @Column({ name: 'categoria_id', nullable: true })
  categoriaId: number;

  @Column({ name: 'miembro_id', nullable: true })
  miembroId: number;  // NULL = anónimo

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
// src/finanzas/finanza-egreso.entity.ts
// ─────────────────────────────────────────────
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
