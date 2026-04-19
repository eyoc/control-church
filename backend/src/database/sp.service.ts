import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

/**
 * Servicio genérico para ejecutar Stored Procedures de SQL Server.
 * Centraliza el acceso a SPs para que cualquier módulo pueda importarlo.
 */
@Injectable()
export class SpService {
  constructor(private dataSource: DataSource) {}

  /**
   * Genera el siguiente número de recibo para una iglesia.
   * Llama a sp_siguiente_correlativo_recibo con UPDLOCK/ROWLOCK.
   * NUNCA incrementar correlativo_recibo directamente desde la aplicación.
   */
  async siguienteCorrelativoRecibo(iglesiaId: number): Promise<string> {
    const result = await this.dataSource.query(
      `DECLARE @numero NVARCHAR(30);
       EXEC sp_siguiente_correlativo_recibo @iglesia_id = @0, @numero_recibo = @numero OUTPUT;
       SELECT @numero AS numero_recibo;`,
      [iglesiaId],
    );
    return result[0]?.numero_recibo as string;
  }
}
