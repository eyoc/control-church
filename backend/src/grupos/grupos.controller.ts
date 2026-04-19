import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { GruposService } from './grupos.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { AgregarMiembroDto } from './dto/agregar-miembro.dto';
import { RemoverMiembroDto } from './dto/remover-miembro.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('grupos')
export class GruposController {
  constructor(private service: GruposService) {}

  @Get()
  findAll(@Query('iglesiaId', ParseIntPipe) iglesiaId: number) {
    return this.service.findAll(iglesiaId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Post()
  create(@Body() dto: CreateGrupoDto) { return this.service.create(dto); }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateGrupoDto>) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }

  // Miembros del grupo
  @Get(':id/miembros')
  findMiembros(@Param('id', ParseIntPipe) id: number) {
    return this.service.findMiembros(id);
  }

  @Post(':id/miembros')
  agregar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AgregarMiembroDto,
  ) {
    return this.service.agregarMiembro(id, dto.miembroId, dto.fechaIngreso);
  }

  @Delete(':id/miembros/:miembroId')
  remover(
    @Param('id', ParseIntPipe) id: number,
    @Param('miembroId', ParseIntPipe) miembroId: number,
    @Body() dto: RemoverMiembroDto,
  ) {
    return this.service.removerMiembro(id, miembroId, dto.fechaSalida);
  }
}
