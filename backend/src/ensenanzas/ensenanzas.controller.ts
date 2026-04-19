import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { EnsenanzasService } from './ensenanzas.service';
import { CreateEnsenanzaDto } from './dto/create-ensenanza.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ensenanzas')
export class EnsenanzasController {
  constructor(private service: EnsenanzasService) {}

  @Get()
  findAll(
    @Query('iglesiaId', ParseIntPipe) iglesiaId: number,
    @Query('tipo') tipo?: string,
  ) {
    return this.service.findAll(iglesiaId, tipo);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Post()
  create(@Body() dto: CreateEnsenanzaDto) { return this.service.create(dto); }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateEnsenanzaDto>) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
