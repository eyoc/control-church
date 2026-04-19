import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { MiembrosService } from './miembros.service';
import { CreateMiembroDto } from './dto/create-miembro.dto';
import { UpdateMiembroDto } from './dto/update-miembro.dto';
import { RegistrarAvanceDiscipuladoDto } from './dto/registrar-avance-discipulado.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('miembros')
export class MiembrosController {
  constructor(private service: MiembrosService) {}

  @Get()
  findAll(@Query('iglesiaId', ParseIntPipe) iglesiaId: number) {
    return this.service.findAll(iglesiaId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Post()
  create(@Body() dto: CreateMiembroDto) { return this.service.create(dto); }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMiembroDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }

  @Get(':id/discipulado')
  historial(@Param('id', ParseIntPipe) id: number) {
    return this.service.findHistorialDiscipulado(id);
  }

  @Post(':id/discipulado')
  avanzar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RegistrarAvanceDiscipuladoDto,
  ) {
    return this.service.registrarAvanceDiscipulado({ miembroId: id, ...dto });
  }
}
