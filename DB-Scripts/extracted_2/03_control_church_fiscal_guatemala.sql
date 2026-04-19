-- ============================================================
-- Control-Church: Campos fiscales Guatemala (SAT / NIT)
-- Script: 03 - ALTER TABLE (ejecutar después del 01)
-- País: Guatemala — moneda GTQ — ente: SAT
-- ============================================================

-- ============================================================
-- 1. ORGANIZACIONES — datos fiscales de la razón social madre
-- ============================================================
ALTER TABLE organizaciones
    ADD nit                 NVARCHAR(20)    NULL,   -- NIT ante la SAT (ej: '1234567-8')
        razon_social_fiscal NVARCHAR(200)   NULL,   -- nombre fiscal (puede diferir del comercial)
        direccion_fiscal    NVARCHAR(300)   NULL,   -- dirección registrada en SAT
        regimen_fiscal      NVARCHAR(60)    NULL;   -- 'Pequeño Contribuyente' | 'General IVA' | 'Exento'

-- ============================================================
-- 2. IGLESIAS — cada sucursal puede tener su propio NIT y emitir
-- ============================================================
ALTER TABLE iglesias
    ADD nit                 NVARCHAR(20)    NULL,       -- NIT propio de la iglesia/sucursal
        razon_social_fiscal NVARCHAR(200)   NULL,       -- nombre fiscal de esta iglesia
        direccion_fiscal    NVARCHAR(300)   NULL,       -- dirección fiscal registrada en SAT
        regimen_fiscal      NVARCHAR(60)    NULL,       -- 'Pequeño Contribuyente' | 'General IVA' | 'Exento'
        es_emisor_facturas  BIT             NOT NULL DEFAULT 0,  -- ¿emite sus propios recibos/facturas?
        tipo_documento      NVARCHAR(20)    NOT NULL DEFAULT 'recibo_interno',
        -- 'recibo_interno'  → recibo simple sin validez tributaria
        -- 'recibo_nit'      → recibo con NIT donante para declaración
        -- 'ambos'           → según lo que pida el donante
        prefijo_recibo      NVARCHAR(15)    NULL,       -- ej: 'IGN-', 'IGL-SUR-' para numeración propia
        correlativo_recibo  INT             NOT NULL DEFAULT 0; -- último correlativo emitido (se incrementa por SP)

-- Constraint para tipo_documento
ALTER TABLE iglesias
    ADD CONSTRAINT CK_iglesias_tipo_documento
        CHECK (tipo_documento IN ('recibo_interno', 'recibo_nit', 'ambos'));

-- ============================================================
-- 3. FINANZAS_INGRESO — datos del donante y documento emitido
-- ============================================================
ALTER TABLE finanzas_ingreso
    ADD numero_recibo       NVARCHAR(30)    NULL,   -- número generado: 'IGN-000123'
        nit_donante         NVARCHAR(20)    NULL,   -- NIT del donante (CF si no aplica)
        nombre_fiscal       NVARCHAR(200)   NULL,   -- nombre fiscal del donante
        tipo_documento_emitido NVARCHAR(20) NULL;   -- 'recibo_interno' | 'recibo_nit' | NULL (sin doc)

ALTER TABLE finanzas_ingreso
    ADD CONSTRAINT CK_fi_tipo_doc_emitido
        CHECK (tipo_documento_emitido IN ('recibo_interno', 'recibo_nit', NULL));

-- Índice para buscar recibos por número (búsqueda frecuente)
CREATE UNIQUE INDEX IX_fi_numero_recibo
    ON finanzas_ingreso(iglesia_id, numero_recibo)
    WHERE numero_recibo IS NOT NULL;

-- ============================================================
-- 4. SP: Generar siguiente correlativo de recibo
--    Uso: EXEC sp_siguiente_correlativo_recibo @iglesia_id = 1
--    Retorna el número formateado y actualiza el correlativo
-- ============================================================
GO

CREATE OR ALTER PROCEDURE sp_siguiente_correlativo_recibo
    @iglesia_id     INT,
    @numero_recibo  NVARCHAR(30) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @prefijo        NVARCHAR(15);
    DECLARE @correlativo    INT;

    -- Bloqueo a nivel de fila para evitar duplicados en concurrencia
    BEGIN TRANSACTION;

        SELECT
            @prefijo        = ISNULL(prefijo_recibo, ''),
            @correlativo    = correlativo_recibo + 1
        FROM iglesias WITH (UPDLOCK, ROWLOCK)
        WHERE id = @iglesia_id;

        IF @correlativo IS NULL
        BEGIN
            ROLLBACK;
            RAISERROR('Iglesia no encontrada: %d', 16, 1, @iglesia_id);
            RETURN;
        END

        UPDATE iglesias
            SET correlativo_recibo = @correlativo
        WHERE id = @iglesia_id;

    COMMIT;

    -- Formato: prefijo + número con ceros a la izquierda (6 dígitos)
    -- Ejemplo: 'IGN-000123'
    SET @numero_recibo = @prefijo + RIGHT('000000' + CAST(@correlativo AS NVARCHAR), 6);
END;
GO

-- ============================================================
-- NOTAS DE IMPLEMENTACIÓN
-- ============================================================
-- 1. "CF" (Consumidor Final) es el NIT estándar en Guatemala
--    cuando el donante no tiene NIT o no quiere factura.
--    En el frontend, si nit_donante está vacío, guardar 'CF'.
--
-- 2. El campo regimen_fiscal en iglesias/organizaciones
--    determina si aplica IVA o no en los recibos.
--    Las iglesias evangélicas generalmente son EXENTAS de IVA
--    según el Decreto 20-2006 de Guatemala.
--
-- 3. correlativo_recibo se maneja SOLO por el SP para garantizar
--    unicidad. Nunca incrementar desde la aplicación directamente.
--
-- 4. Si iglesia.es_emisor_facturas = 0, usar el NIT de la
--    organizacion madre para los recibos.
-- ============================================================
