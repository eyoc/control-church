import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Iglesia } from './iglesia.entity';
import { IglesiasService } from './iglesias.service';
import { IglesiasController } from './iglesias.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Iglesia])],
  controllers: [IglesiasController],
  providers: [IglesiasService],
  exports: [IglesiasService],
})
export class IglesiasModule {}
