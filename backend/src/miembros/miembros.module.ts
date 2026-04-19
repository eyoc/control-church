import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Miembro } from './miembro.entity';
import { EtapaDiscipulado } from './etapa-discipulado.entity';
import { MiembroDiscipulado } from './miembro-discipulado.entity';
import { MiembrosService } from './miembros.service';
import { MiembrosController } from './miembros.controller';
import { EtapasDiscipuladoController } from './etapas-discipulado.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Miembro, EtapaDiscipulado, MiembroDiscipulado])],
  controllers: [MiembrosController, EtapasDiscipuladoController],
  providers: [MiembrosService],
  exports: [MiembrosService],
})
export class MiembrosModule {}
