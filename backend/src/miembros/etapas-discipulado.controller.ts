import { Controller, Get, Post, Body, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { MiembrosService } from './miembros.service';
import { CreateEtapaDto } from './dto/create-etapa.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('etapas-discipulado')
export class EtapasDiscipuladoController {
  constructor(private service: MiembrosService) {}

  @Get()
  findAll(@Query('iglesiaId', ParseIntPipe) iglesiaId: number) {
    return this.service.findEtapas(iglesiaId);
  }

  @Post()
  create(@Body() dto: CreateEtapaDto) {
    return this.service.createEtapa(dto);
  }
}
