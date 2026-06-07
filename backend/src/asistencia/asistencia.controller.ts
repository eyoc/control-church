import {
  Controller, Get, Post, Put, Param, Body, Query,
  ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';
import { CreateAsistenciaDto, UpdateAsistenciaDetalleDto } from './dto/create-asistencia.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Usuario } from '../usuarios/usuario.entity';

@UseGuards(JwtAuthGuard)
@Controller('asistencia')
export class AsistenciaController {
  constructor(private service: AsistenciaService) {}

  @Get()
  findAll(
    @Query('iglesiaId', ParseIntPipe) iglesiaId: number,
    @Query('grupoId') grupoId?: string,
  ) {
    return this.service.findAll(iglesiaId, grupoId ? +grupoId : undefined);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Post()
  create(
    @Body() dto: CreateAsistenciaDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.service.create(dto, user.id);
  }

  @Put(':id')
  updateDetalle(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAsistenciaDetalleDto,
  ) {
    return this.service.updateDetalle(id, dto.detalle);
  }

  @Get('resumen/miembro/:miembroId')
  resumen(
    @Param('miembroId', ParseIntPipe) miembroId: number,
    @Query('iglesiaId', ParseIntPipe) iglesiaId: number,
  ) {
    return this.service.resumenPorMiembro(iglesiaId, miembroId);
  }
}
