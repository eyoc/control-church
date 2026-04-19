import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { IglesiasService } from './iglesias.service';
import { CreateIglesiaDto } from './dto/create-iglesia.dto';
import { UpdateIglesiaDto } from './dto/update-iglesia.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('iglesias')
export class IglesiasController {
  constructor(private service: IglesiasService) {}

  @Get()
  findAll(@Query('organizacionId') organizacionId?: string) {
    return this.service.findAll(organizacionId ? +organizacionId : undefined);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Post()
  create(@Body() dto: CreateIglesiaDto) { return this.service.create(dto); }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateIglesiaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
