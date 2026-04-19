import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpService } from './sp.service';
import { Organizacion } from '../organizaciones/organizacion.entity';
import { Iglesia } from '../iglesias/iglesia.entity';
import { Usuario } from '../usuarios/usuario.entity';
import { RolUsuario } from '../usuarios/rol-usuario.entity';
import { UsuarioIglesiaRol } from '../usuarios/usuario-iglesia-rol.entity';
import { Miembro } from '../miembros/miembro.entity';
import { EtapaDiscipulado } from '../miembros/etapa-discipulado.entity';
import { MiembroDiscipulado } from '../miembros/miembro-discipulado.entity';
import { Grupo } from '../grupos/grupo.entity';
import { GrupoMiembro } from '../grupos/grupo-miembro.entity';
import { Asistencia } from '../asistencia/asistencia.entity';
import { AsistenciaDetalle } from '../asistencia/asistencia-detalle.entity';
import { Ensenanza } from '../ensenanzas/ensenanza.entity';
import { CategoriaFinanciera } from '../finanzas/categoria-financiera.entity';
import { FinanzaIngreso } from '../finanzas/finanza-ingreso.entity';
import { FinanzaEgreso } from '../finanzas/finanza-egreso.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mssql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT ?? '1433', 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        synchronize: false, // NUNCA true — las tablas se crean con scripts SQL
        logging: process.env.NODE_ENV === 'development',
        options: {
          encrypt: process.env.DB_ENCRYPT !== 'false',
          trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        },
        entities: [
          Organizacion,
          Iglesia,
          Usuario,
          RolUsuario,
          UsuarioIglesiaRol,
          Miembro,
          EtapaDiscipulado,
          MiembroDiscipulado,
          Grupo,
          GrupoMiembro,
          Asistencia,
          AsistenciaDetalle,
          Ensenanza,
          CategoriaFinanciera,
          FinanzaIngreso,
          FinanzaEgreso,
        ],
      }),
    }),
  ],
  providers: [SpService],
  exports: [SpService],
})
export class DatabaseModule {}
