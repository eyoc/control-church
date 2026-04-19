import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ensenanza } from './ensenanza.entity';
import { EnsenanzasService } from './ensenanzas.service';
import { EnsenanzasController } from './ensenanzas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ensenanza])],
  controllers: [EnsenanzasController],
  providers: [EnsenanzasService],
})
export class EnsenanzasModule {}
