import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaFinanciera } from './categoria-financiera.entity';
import { FinanzaIngreso } from './finanza-ingreso.entity';
import { FinanzaEgreso } from './finanza-egreso.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { CreateIngresoDto } from './dto/create-ingreso.dto';
import { CreateEgresoDto } from './dto/create-egreso.dto';
import { SpService } from '../database/sp.service';

@Injectable()
export class FinanzasService {
  constructor(
    @InjectRepository(CategoriaFinanciera)
    private categoriasRepo: Repository<CategoriaFinanciera>,
    @InjectRepository(FinanzaIngreso)
    private ingresoRepo: Repository<FinanzaIngreso>,
    @InjectRepository(FinanzaEgreso)
    private egresoRepo: Repository<FinanzaEgreso>,
    private spService: SpService,
  ) {}

  // ── Categorías ────────────────────────────────────────────────
  findCategorias(iglesiaId: number, tipo?: 'I' | 'E') {
    const where: any = { iglesiaId, activo: true };
    if (tipo) where.tipo = tipo;
    return this.categoriasRepo.find({ where, order: { nombre: 'ASC' } });
  }

  createCategoria(dto: CreateCategoriaDto) {
    return this.categoriasRepo.save(this.categoriasRepo.create(dto));
  }

  async updateCategoria(id: number, dto: Partial<CreateCategoriaDto>) {
    const c = await this.categoriasRepo.findOne({ where: { id } });
    if (!c) throw new NotFoundException(`Categoría ${id} no encontrada`);
    await this.categoriasRepo.update(id, dto);
    return this.categoriasRepo.findOne({ where: { id } });
  }

  // ── Recibos (SP) ─────────────────────────────────────────────
  async generarNumeroRecibo(iglesiaId: number): Promise<string> {
    return this.spService.siguienteCorrelativoRecibo(iglesiaId);
  }

  // ── Ingresos ─────────────────────────────────────────────────
  findIngresos(iglesiaId: number, desde?: string, hasta?: string) {
    const qb = this.ingresoRepo
      .createQueryBuilder('fi')
      .where('fi.iglesia_id = :iglesiaId', { iglesiaId })
      .leftJoinAndSelect('fi.categoria', 'cat')
      .leftJoinAndSelect('fi.miembro', 'mie')
      .leftJoinAndSelect('fi.registrador', 'usr')
      .orderBy('fi.fecha', 'DESC');
    if (desde) qb.andWhere('fi.fecha >= :desde', { desde });
    if (hasta) qb.andWhere('fi.fecha <= :hasta', { hasta });
    return qb.getMany();
  }

  async createIngreso(dto: CreateIngresoDto, registradoPor: number) {
    let numeroRecibo: string | null = null;

    if (dto.emitirRecibo) {
      numeroRecibo = await this.generarNumeroRecibo(dto.iglesiaId);
    }

    const nitDonante = dto.emitirRecibo
      ? (dto.nitDonante?.trim() || 'CF')
      : null;

    return this.ingresoRepo.save(
      this.ingresoRepo.create({
        iglesiaId: dto.iglesiaId,
        categoriaId: dto.categoriaId ?? null,
        miembroId: dto.miembroId ?? null,
        registradoPor,
        monto: dto.monto,
        moneda: dto.moneda ?? 'GTQ',
        fecha: dto.fecha,
        descripcion: dto.descripcion,
        comprobanteUrl: dto.comprobanteUrl,
        numeroRecibo,
        nitDonante,
        nombreFiscal: dto.nombreFiscal,
        tipoDocumentoEmitido: dto.emitirRecibo ? dto.tipoDocumento : null,
      }),
    );
  }

  // ── Egresos ──────────────────────────────────────────────────
  findEgresos(iglesiaId: number, desde?: string, hasta?: string) {
    const qb = this.egresoRepo
      .createQueryBuilder('fe')
      .where('fe.iglesia_id = :iglesiaId', { iglesiaId })
      .leftJoinAndSelect('fe.categoria', 'cat')
      .leftJoinAndSelect('fe.registrador', 'usr')
      .orderBy('fe.fecha', 'DESC');
    if (desde) qb.andWhere('fe.fecha >= :desde', { desde });
    if (hasta) qb.andWhere('fe.fecha <= :hasta', { hasta });
    return qb.getMany();
  }

  createEgreso(dto: CreateEgresoDto, registradoPor: number) {
    return this.egresoRepo.save(
      this.egresoRepo.create({ ...dto, registradoPor, moneda: dto.moneda ?? 'GTQ' }),
    );
  }

  // ── Resumen financiero ───────────────────────────────────────
  async resumen(iglesiaId: number, desde: string, hasta: string) {
    const [ingresos, egresos] = await Promise.all([
      this.ingresoRepo
        .createQueryBuilder('fi')
        .select('SUM(fi.monto)', 'total')
        .where('fi.iglesia_id = :iglesiaId AND fi.fecha BETWEEN :desde AND :hasta', {
          iglesiaId, desde, hasta,
        })
        .getRawOne(),
      this.egresoRepo
        .createQueryBuilder('fe')
        .select('SUM(fe.monto)', 'total')
        .where('fe.iglesia_id = :iglesiaId AND fe.fecha BETWEEN :desde AND :hasta', {
          iglesiaId, desde, hasta,
        })
        .getRawOne(),
    ]);

    const totalIngresos = parseFloat(ingresos?.total ?? '0');
    const totalEgresos = parseFloat(egresos?.total ?? '0');
    return {
      desde,
      hasta,
      iglesiaId,
      totalIngresos,
      totalEgresos,
      saldo: totalIngresos - totalEgresos,
    };
  }
}
