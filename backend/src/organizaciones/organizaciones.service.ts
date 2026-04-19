import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organizacion } from './organizacion.entity';
import { CreateOrganizacionDto } from './dto/create-organizacion.dto';
import { UpdateOrganizacionDto } from './dto/update-organizacion.dto';

@Injectable()
export class OrganizacionesService {
  constructor(
    @InjectRepository(Organizacion)
    private repo: Repository<Organizacion>,
  ) {}

  findAll() {
    return this.repo.find({ where: { activo: true }, order: { nombre: 'ASC' } });
  }

  async findOne(id: number) {
    const org = await this.repo.findOne({
      where: { id },
      relations: ['iglesias'],
    });
    if (!org) throw new NotFoundException(`Organización ${id} no encontrada`);
    return org;
  }

  create(dto: CreateOrganizacionDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateOrganizacionDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.update(id, { activo: false });
  }
}
