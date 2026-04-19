import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { RolUsuario } from './rol-usuario.entity';
import { UsuarioIglesiaRol } from './usuario-iglesia-rol.entity';
import { AsignarRolDto } from './dto/asignar-rol.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepo: Repository<Usuario>,
    @InjectRepository(RolUsuario)
    private rolesRepo: Repository<RolUsuario>,
    @InjectRepository(UsuarioIglesiaRol)
    private uirRepo: Repository<UsuarioIglesiaRol>,
  ) {}

  findAll() {
    return this.usuariosRepo.find({
      where: { activo: true },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number) {
    const u = await this.usuariosRepo.findOne({
      where: { id },
      relations: ['usuarioIglesiaRoles', 'usuarioIglesiaRoles.iglesia', 'usuarioIglesiaRoles.rol'],
    });
    if (!u) throw new NotFoundException(`Usuario ${id} no encontrado`);
    return u;
  }

  findRoles() {
    return this.rolesRepo.find({ order: { nivel: 'ASC' } });
  }

  async asignarRol(usuarioId: number, dto: AsignarRolDto) {
    const existe = await this.uirRepo.findOne({
      where: { usuarioId, iglesiaId: dto.iglesiaId, rolId: dto.rolId },
    });
    if (existe) {
      if (!existe.activo) {
        await this.uirRepo.update(existe.id, { activo: true });
        return this.uirRepo.findOne({ where: { id: existe.id }, relations: ['rol', 'iglesia'] });
      }
      throw new ConflictException('El usuario ya tiene ese rol en esa iglesia');
    }
    return this.uirRepo.save(
      this.uirRepo.create({ usuarioId, iglesiaId: dto.iglesiaId, rolId: dto.rolId }),
    );
  }

  async revocarRol(usuarioId: number, iglesiaId: number, rolId: number) {
    const uir = await this.uirRepo.findOne({ where: { usuarioId, iglesiaId, rolId } });
    if (!uir) throw new NotFoundException('Asignación de rol no encontrada');
    await this.uirRepo.update(uir.id, { activo: false });
  }

  async desactivar(id: number) {
    await this.findOne(id);
    await this.usuariosRepo.update(id, { activo: false });
  }
}
