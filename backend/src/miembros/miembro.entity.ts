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
  genero: string; // 'M' | 'F'

  @Column({ name: 'estado_civil', length: 20, nullable: true })
  estadoCivil: string; // 'soltero' | 'casado' | 'viudo' | 'divorciado'

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
