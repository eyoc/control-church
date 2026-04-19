import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asistencia } from './asistencia.entity';
import { AsistenciaDetalle } from './asistencia-detalle.entity';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';

@Injectable()
export class AsistenciaService {
  constructor(
    @InjectRepository(Asistencia)
    private asistenciaRepo: Repository<Asistencia>,
    @InjectRepository(AsistenciaDetalle)
    private detalleRepo: Repository<AsistenciaDetalle>,
  ) {}

  findAll(iglesiaId: number, grupoId?: number) {
    const where: any = { iglesiaId };
    if (grupoId) where.grupoId = grupoId;
    return this.asistenciaRepo.find({
      where,
      relations: ['grupo', 'registrador'],
      order: { fecha: 'DESC' },
    });
  }

  async findOne(id: number) {
    const a = await this.asistenciaRepo.findOne({
      where: { id },
      relations: ['grupo', 'registrador', 'detalle', 'detalle.miembro'],
    });
    if (!a) throw new NotFoundException(`Asistencia ${id} no encontrada`);
    return a;
  }

  async create(dto: CreateAsistenciaDto, registradoPor: number) {
    const { detalle, ...cabecera } = dto;
    const asistencia = await this.asistenciaRepo.save(
      this.asistenciaRepo.create({ ...cabecera, registradoPor }),
    );

    if (detalle?.length) {
      const detalles = detalle.map((d) =>
        this.detalleRepo.create({
          asistenciaId: asistencia.id,
          miembroId: d.miembroId,
          presente: d.presente ?? true,
          justificado: d.justificado ?? false,
          notas: d.notas,
        }),
      );
      await this.detalleRepo.save(detalles);
    }

    return this.findOne(asistencia.id);
  }

  async resumenPorMiembro(iglesiaId: number, miembroId: number) {
    const total = await this.asistenciaRepo.count({ where: { iglesiaId } });
    const presentes = await this.detalleRepo.count({
      where: { miembroId, presente: true, asistencia: { iglesiaId } },
      relations: ['asistencia'],
    });
    return { total, presentes, porcentaje: total ? Math.round((presentes / total) * 100) : 0 };
  }
}
