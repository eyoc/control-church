import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaFinanciera } from './categoria-financiera.entity';
import { FinanzaIngreso } from './finanza-ingreso.entity';
import { FinanzaEgreso } from './finanza-egreso.entity';
import { FinanzasService } from './finanzas.service';
import { FinanzasController } from './finanzas.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoriaFinanciera, FinanzaIngreso, FinanzaEgreso]),
    DatabaseModule,
  ],
  controllers: [FinanzasController],
  providers: [FinanzasService],
})
export class FinanzasModule {}
