import {
  Controller, Get, Post, Put, Param, Body,
  Query, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { FinanzasService } from './finanzas.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { CreateIngresoDto } from './dto/create-ingreso.dto';
import { CreateEgresoDto } from './dto/create-egreso.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Usuario } from '../usuarios/usuario.entity';

@UseGuards(JwtAuthGuard)
@Controller('finanzas')
export class FinanzasController {
  constructor(private service: FinanzasService) {}

  // ── Categorías ──────────────────────────────────────────────
  @Get('categorias')
  findCategorias(
    @Query('iglesiaId', ParseIntPipe) iglesiaId: number,
    @Query('tipo') tipo?: 'I' | 'E',
  ) {
    return this.service.findCategorias(iglesiaId, tipo);
  }

  @Post('categorias')
  createCategoria(@Body() dto: CreateCategoriaDto) {
    return this.service.createCategoria(dto);
  }

  @Put('categorias/:id')
  updateCategoria(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateCategoriaDto>,
  ) {
    return this.service.updateCategoria(id, dto);
  }

  // ── Ingresos ────────────────────────────────────────────────
  @Get('ingresos')
  findIngresos(
    @Query('iglesiaId', ParseIntPipe) iglesiaId: number,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.service.findIngresos(iglesiaId, desde, hasta);
  }

  @Post('ingresos')
  createIngreso(@Body() dto: CreateIngresoDto, @CurrentUser() user: Usuario) {
    return this.service.createIngreso(dto, user.id);
  }

  // ── Egresos ─────────────────────────────────────────────────
  @Get('egresos')
  findEgresos(
    @Query('iglesiaId', ParseIntPipe) iglesiaId: number,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.service.findEgresos(iglesiaId, desde, hasta);
  }

  @Post('egresos')
  createEgreso(@Body() dto: CreateEgresoDto, @CurrentUser() user: Usuario) {
    return this.service.createEgreso(dto, user.id);
  }

  // ── Resumen ─────────────────────────────────────────────────
  @Get('resumen')
  resumen(
    @Query('iglesiaId', ParseIntPipe) iglesiaId: number,
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    return this.service.resumen(iglesiaId, desde, hasta);
  }
}
