import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { Miembro } from '../miembros/miembro.entity';
import { Grupo } from '../grupos/grupo.entity';
import { Asistencia } from '../asistencia/asistencia.entity';
import { AsistenciaDetalle } from '../asistencia/asistencia-detalle.entity';
import { FinanzaIngreso } from '../finanzas/finanza-ingreso.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Miembro,
      Grupo,
      Asistencia,
      AsistenciaDetalle,
      FinanzaIngreso,
    ]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
