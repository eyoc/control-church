import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Miembro } from '../miembros/miembro.entity';
import { Grupo } from '../grupos/grupo.entity';
import { AsistenciaDetalle } from '../asistencia/asistencia-detalle.entity';
import { Asistencia } from '../asistencia/asistencia.entity';
import { FinanzaIngreso } from '../finanzas/finanza-ingreso.entity';

export interface StatsDto {
  totalMiembros: number;
  totalGrupos: number;
  asistenciaPromedio: number;
  ingresosMes: number;
}

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Miembro)
    private readonly miembroRepo: Repository<Miembro>,
    @InjectRepository(Grupo)
    private readonly grupoRepo: Repository<Grupo>,
    @InjectRepository(Asistencia)
    private readonly asistenciaRepo: Repository<Asistencia>,
    @InjectRepository(AsistenciaDetalle)
    private readonly detalleRepo: Repository<AsistenciaDetalle>,
    @InjectRepository(FinanzaIngreso)
    private readonly ingresoRepo: Repository<FinanzaIngreso>,
  ) {}

  async getStats(iglesiaId: number): Promise<StatsDto> {
    // 1. Total miembros activos
    const totalMiembros = await this.miembroRepo.count({
      where: { iglesiaId, esActivo: true },
    });

    // 2. Total grupos activos
    const totalGrupos = await this.grupoRepo.count({
      where: { iglesiaId, activo: true },
    });

    // 3. Asistencia promedio del mes actual
    const now = new Date();
    const primerDiaMes = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const ultimoDiaMes = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()).padStart(2, '0')}`;

    let asistenciaPromedio = 0;

    const asistenciasMes = await this.asistenciaRepo.find({
      where: {
        iglesiaId,
        fecha: Between(primerDiaMes, ultimoDiaMes),
      },
      select: ['id'],
    });

    if (asistenciasMes.length > 0) {
      const asistenciaIds = asistenciasMes.map((a) => a.id);

      const totalRegistros = await this.detalleRepo
        .createQueryBuilder('d')
        .where('d.asistencia_id IN (:...ids)', { ids: asistenciaIds })
        .getCount();

      const totalPresentes = await this.detalleRepo
        .createQueryBuilder('d')
        .where('d.asistencia_id IN (:...ids)', { ids: asistenciaIds })
        .andWhere('d.presente = :presente', { presente: true })
        .getCount();

      asistenciaPromedio =
        totalRegistros > 0
          ? Math.round((totalPresentes / totalRegistros) * 1000) / 10
          : 0;
    }

    // 4. Total ingresos del mes actual
    const ingresoResult = await this.ingresoRepo
      .createQueryBuilder('i')
      .select('COALESCE(SUM(i.monto), 0)', 'total')
      .where('i.iglesia_id = :iglesiaId', { iglesiaId })
      .andWhere('i.fecha BETWEEN :inicio AND :fin', {
        inicio: primerDiaMes,
        fin: ultimoDiaMes,
      })
      .getRawOne();

    const ingresosMes = parseFloat(ingresoResult?.total ?? '0');

    return {
      totalMiembros,
      totalGrupos,
      asistenciaPromedio,
      ingresosMes,
    };
  }
}
