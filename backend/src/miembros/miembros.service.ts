import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Miembro } from './miembro.entity';
import { EtapaDiscipulado } from './etapa-discipulado.entity';
import { MiembroDiscipulado } from './miembro-discipulado.entity';
import { CreateMiembroDto } from './dto/create-miembro.dto';
import { UpdateMiembroDto } from './dto/update-miembro.dto';
import { CreateEtapaDto } from './dto/create-etapa.dto';

@Injectable()
export class MiembrosService {
  constructor(
    @InjectRepository(Miembro)
    private miembrosRepo: Repository<Miembro>,
    @InjectRepository(EtapaDiscipulado)
    private etapasRepo: Repository<EtapaDiscipulado>,
    @InjectRepository(MiembroDiscipulado)
    private discipuladoRepo: Repository<MiembroDiscipulado>,
  ) {}

  // ── Miembros ─────────────────────────────────────────────────
  findAll(iglesiaId: number) {
    return this.miembrosRepo.find({
      where: { iglesiaId, esActivo: true },
      relations: ['etapaDiscipulado'],
      order: { apellido: 'ASC', nombre: 'ASC' },
    });
  }

  async findOne(id: number) {
    const m = await this.miembrosRepo.findOne({
      where: { id },
      relations: ['iglesia', 'etapaDiscipulado', 'usuario'],
    });
    if (!m) throw new NotFoundException(`Miembro ${id} no encontrado`);
    return m;
  }

  create(dto: CreateMiembroDto) {
    return this.miembrosRepo.save(this.miembrosRepo.create(dto));
  }

  async update(id: number, dto: UpdateMiembroDto) {
    await this.findOne(id);
    await this.miembrosRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.miembrosRepo.update(id, { esActivo: false });
  }

  // ── Etapas de discipulado ────────────────────────────────────
  findEtapas(iglesiaId: number) {
    return this.etapasRepo.find({
      where: { iglesiaId, activo: true },
      order: { orden: 'ASC' },
    });
  }

  createEtapa(dto: CreateEtapaDto) {
    return this.etapasRepo.save(this.etapasRepo.create(dto));
  }

  // ── Historial de discipulado ─────────────────────────────────
  findHistorialDiscipulado(miembroId: number) {
    return this.discipuladoRepo.find({
      where: { miembroId },
      relations: ['etapaDiscipulado', 'mentor'],
      order: { fechaInicio: 'DESC' },
    });
  }

  async registrarAvanceDiscipulado(dto: {
    miembroId: number;
    etapaDiscipuladoId: number;
    mentorUsuarioId?: number;
    fechaInicio: string;
    notas?: string;
  }) {
    // Cerrar etapa actual
    await this.discipuladoRepo
      .createQueryBuilder()
      .update()
      .set({ fechaFin: dto.fechaInicio })
      .where('miembro_id = :mid AND fecha_fin IS NULL', { mid: dto.miembroId })
      .execute();

    // Actualizar etapa actual del miembro
    await this.miembrosRepo.update(dto.miembroId, {
      etapaDiscipuladoId: dto.etapaDiscipuladoId,
    });

    return this.discipuladoRepo.save(
      this.discipuladoRepo.create({
        miembroId: dto.miembroId,
        etapaDiscipuladoId: dto.etapaDiscipuladoId,
        mentorUsuarioId: dto.mentorUsuarioId,
        fechaInicio: dto.fechaInicio,
        notas: dto.notas,
      }),
    );
  }
}
