import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { OrganizacionesModule } from './organizaciones/organizaciones.module';
import { IglesiasModule } from './iglesias/iglesias.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { MiembrosModule } from './miembros/miembros.module';
import { GruposModule } from './grupos/grupos.module';
import { AsistenciaModule } from './asistencia/asistencia.module';
import { EnsenanzasModule } from './ensenanzas/ensenanzas.module';
import { FinanzasModule } from './finanzas/finanzas.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    OrganizacionesModule,
    IglesiasModule,
    UsuariosModule,
    MiembrosModule,
    GruposModule,
    AsistenciaModule,
    EnsenanzasModule,
    FinanzasModule,
  ],
})
export class AppModule {}
