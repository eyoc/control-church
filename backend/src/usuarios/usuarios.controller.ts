import {
  Controller, Get, Post, Delete,
  Param, Body, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { AsignarRolDto } from './dto/asignar-rol.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private service: UsuariosService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Get('roles')
  findRoles() { return this.service.findRoles(); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Post(':id/roles')
  asignarRol(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AsignarRolDto,
  ) {
    return this.service.asignarRol(id, dto);
  }

  @Delete(':id/roles/:iglesiaId/:rolId')
  revocarRol(
    @Param('id', ParseIntPipe) id: number,
    @Param('iglesiaId', ParseIntPipe) iglesiaId: number,
    @Param('rolId', ParseIntPipe) rolId: number,
  ) {
    return this.service.revocarRol(id, iglesiaId, rolId);
  }

  @Delete(':id')
  desactivar(@Param('id', ParseIntPipe) id: number) { return this.service.desactivar(id); }
}
