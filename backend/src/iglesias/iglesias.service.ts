import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Iglesia } from './iglesia.entity';
import { CreateIglesiaDto } from './dto/create-iglesia.dto';
import { UpdateIglesiaDto } from './dto/update-iglesia.dto';

@Injectable()
export class IglesiasService {
  constructor(
    @InjectRepository(Iglesia)
    private repo: Repository<Iglesia>,
  ) {}

  findAll(organizacionId?: number) {
    const where: any = { activo: true };
    if (organizacionId) where.organizacionId = organizacionId;
    return this.repo.find({
      where,
      relations: ['organizacion'],
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number) {
    const iglesia = await this.repo.findOne({
      where: { id },
      relations: ['organizacion', 'iglesiaPadre', 'sucursales'],
    });
    if (!iglesia) throw new NotFoundException(`Iglesia ${id} no encontrada`);
    return iglesia;
  }

  create(dto: CreateIglesiaDto) {
    return this.repo.save(this.repo.create(dto as any));
  }

  async update(id: number, dto: UpdateIglesiaDto) {
    await this.findOne(id);
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.update(id, { activo: false });
  }
}
