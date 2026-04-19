import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ensenanza } from './ensenanza.entity';
import { CreateEnsenanzaDto } from './dto/create-ensenanza.dto';

@Injectable()
export class EnsenanzasService {
  constructor(
    @InjectRepository(Ensenanza)
    private repo: Repository<Ensenanza>,
  ) {}

  findAll(iglesiaId: number, tipo?: string) {
    const where: any = { iglesiaId, activo: true };
    if (tipo) where.tipo = tipo;
    return this.repo.find({
      where,
      relations: ['autor'],
      order: { fecha: 'DESC', creadoEn: 'DESC' },
    });
  }

  async findOne(id: number) {
    const e = await this.repo.findOne({
      where: { id },
      relations: ['autor', 'iglesia'],
    });
    if (!e) throw new NotFoundException(`Enseñanza ${id} no encontrada`);
    return e;
  }

  create(dto: CreateEnsenanzaDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: Partial<CreateEnsenanzaDto>) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.update(id, { activo: false });
  }
}
