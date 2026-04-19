import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grupo } from './grupo.entity';
import { GrupoMiembro } from './grupo-miembro.entity';
import { CreateGrupoDto } from './dto/create-grupo.dto';

@Injectable()
export class GruposService {
  constructor(
    @InjectRepository(Grupo)
    private gruposRepo: Repository<Grupo>,
    @InjectRepository(GrupoMiembro)
    private grupoMiembroRepo: Repository<GrupoMiembro>,
  ) {}

  findAll(iglesiaId: number) {
    return this.gruposRepo.find({
      where: { iglesiaId, activo: true },
      relations: ['lider'],
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number) {
    const g = await this.gruposRepo.findOne({
      where: { id },
      relations: ['lider', 'iglesia'],
    });
    if (!g) throw new NotFoundException(`Grupo ${id} no encontrado`);
    return g;
  }

  create(dto: CreateGrupoDto) {
    return this.gruposRepo.save(this.gruposRepo.create(dto));
  }

  async update(id: number, dto: Partial<CreateGrupoDto>) {
    await this.findOne(id);
    await this.gruposRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.gruposRepo.update(id, { activo: false });
  }

  // ── Miembros del grupo ───────────────────────────────────────
  findMiembros(grupoId: number) {
    return this.grupoMiembroRepo.find({
      where: { grupoId, activo: true },
      relations: ['miembro'],
    });
  }

  async agregarMiembro(grupoId: number, miembroId: number, fechaIngreso: string) {
    const existe = await this.grupoMiembroRepo.findOne({ where: { grupoId, miembroId } });
    if (existe?.activo) throw new ConflictException('El miembro ya está en el grupo');
    if (existe) {
      await this.grupoMiembroRepo.update(existe.id, { activo: true, fechaSalida: null });
      return existe;
    }
    return this.grupoMiembroRepo.save(
      this.grupoMiembroRepo.create({ grupoId, miembroId, fechaIngreso }),
    );
  }

  async removerMiembro(grupoId: number, miembroId: number, fechaSalida: string) {
    const gm = await this.grupoMiembroRepo.findOne({ where: { grupoId, miembroId, activo: true } });
    if (!gm) throw new NotFoundException('El miembro no está activo en el grupo');
    await this.grupoMiembroRepo.update(gm.id, { activo: false, fechaSalida });
  }
}
