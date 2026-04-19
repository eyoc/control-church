-- ============================================================
-- Control-Church: Script de creación de tablas
-- Base de datos: SQL Server (Azure Serverless)
-- Fecha: 2026
-- IMPORTANTE: Ejecutar en orden. No usar synchronize en TypeORM.
-- ============================================================

-- ============================================================
-- 1. ORGANIZACIONES
--    Razón social / iglesia madre / denominación
-- ============================================================
CREATE TABLE organizaciones (
    id              INT IDENTITY(1,1)   NOT NULL,
    nombre          NVARCHAR(150)       NOT NULL,
    descripcion     NVARCHAR(500)       NULL,
    logo_url        NVARCHAR(500)       NULL,    -- Azure Blob Storage
    sitio_web       NVARCHAR(200)       NULL,
    pais            NVARCHAR(80)        NOT NULL DEFAULT 'Guatemala',
    activo          BIT                 NOT NULL DEFAULT 1,
    creado_en       DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    actualizado_en  DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_organizaciones PRIMARY KEY (id)
);

-- ============================================================
-- 2. IGLESIAS
--    Congregaciones. Puede tener iglesia_padre_id (sucursales)
-- ============================================================
CREATE TABLE iglesias (
    id                  INT IDENTITY(1,1)   NOT NULL,
    organizacion_id     INT                 NOT NULL,
    iglesia_padre_id    INT                 NULL,       -- NULL = sede principal
    nombre              NVARCHAR(150)       NOT NULL,
    direccion           NVARCHAR(300)       NULL,
    ciudad              NVARCHAR(100)       NULL,
    pais                NVARCHAR(80)        NOT NULL DEFAULT 'Guatemala',
    telefono            NVARCHAR(30)        NULL,
    email               NVARCHAR(150)       NULL,
    logo_url            NVARCHAR(500)       NULL,
    activo              BIT                 NOT NULL DEFAULT 1,
    creado_en           DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    actualizado_en      DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_iglesias PRIMARY KEY (id),
    CONSTRAINT FK_iglesias_organizacion  FOREIGN KEY (organizacion_id) REFERENCES organizaciones(id),
    CONSTRAINT FK_iglesias_padre         FOREIGN KEY (iglesia_padre_id) REFERENCES iglesias(id)
);

-- ============================================================
-- 3. ROLES_USUARIO
--    Catálogo: SuperAdmin, Pastor, Administrador, Líder, Miembro
-- ============================================================
CREATE TABLE roles_usuario (
    id          INT IDENTITY(1,1)   NOT NULL,
    nombre      NVARCHAR(60)        NOT NULL,   -- 'pastor', 'lider_grupo', 'admin', etc.
    descripcion NVARCHAR(200)       NULL,
    nivel       INT                 NOT NULL DEFAULT 10, -- 1=SuperAdmin, 10=básico
    CONSTRAINT PK_roles_usuario PRIMARY KEY (id),
    CONSTRAINT UQ_roles_usuario_nombre UNIQUE (nombre)
);

-- Datos semilla de roles
INSERT INTO roles_usuario (nombre, descripcion, nivel) VALUES
    ('superadmin',      'Acceso total al sistema',              1),
    ('pastor',          'Pastor principal de la iglesia',       2),
    ('administrador',   'Administrador de la iglesia',          3),
    ('lider_grupo',     'Líder de grupo pequeño / célula',      5),
    ('miembro',         'Miembro general (solo lectura)',        10);

-- ============================================================
-- 4. USUARIOS
--    Acceso al sistema. Un usuario puede pertenecer a múltiples iglesias.
-- ============================================================
CREATE TABLE usuarios (
    id              INT IDENTITY(1,1)   NOT NULL,
    email           NVARCHAR(150)       NOT NULL,
    nickname        NVARCHAR(60)        NULL,
    nombre          NVARCHAR(100)       NOT NULL,
    apellido        NVARCHAR(100)       NULL,
    google_id       NVARCHAR(100)       NULL,       -- OAuth Google
    password_hash   NVARCHAR(255)       NULL,       -- NULL si solo usa Google
    foto_url        NVARCHAR(500)       NULL,
    activo          BIT                 NOT NULL DEFAULT 1,
    creado_en       DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    actualizado_en  DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_usuarios PRIMARY KEY (id),
    CONSTRAINT UQ_usuarios_email    UNIQUE (email),
    CONSTRAINT UQ_usuarios_google   UNIQUE (google_id)
);

-- ============================================================
-- 5. USUARIO_IGLESIA_ROL
--    Qué rol tiene cada usuario en cada iglesia (N:M con rol)
-- ============================================================
CREATE TABLE usuario_iglesia_rol (
    id          INT IDENTITY(1,1)   NOT NULL,
    usuario_id  INT                 NOT NULL,
    iglesia_id  INT                 NOT NULL,
    rol_id      INT                 NOT NULL,
    activo      BIT                 NOT NULL DEFAULT 1,
    creado_en   DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_usuario_iglesia_rol PRIMARY KEY (id),
    CONSTRAINT FK_uir_usuario   FOREIGN KEY (usuario_id)    REFERENCES usuarios(id),
    CONSTRAINT FK_uir_iglesia   FOREIGN KEY (iglesia_id)    REFERENCES iglesias(id),
    CONSTRAINT FK_uir_rol       FOREIGN KEY (rol_id)        REFERENCES roles_usuario(id),
    CONSTRAINT UQ_uir_usuario_iglesia_rol UNIQUE (usuario_id, iglesia_id, rol_id)
);

-- ============================================================
-- 6. ETAPAS_DISCIPULADO
--    Catálogo configurable por iglesia
-- ============================================================
CREATE TABLE etapas_discipulado (
    id          INT IDENTITY(1,1)   NOT NULL,
    iglesia_id  INT                 NOT NULL,
    nombre      NVARCHAR(100)       NOT NULL,   -- 'Nuevo Creyente', 'Consolidado', 'Discípulo', 'Líder'
    descripcion NVARCHAR(300)       NULL,
    orden       INT                 NOT NULL DEFAULT 1,
    color_hex   NCHAR(7)            NULL,       -- para UI: '#4CAF50'
    activo      BIT                 NOT NULL DEFAULT 1,
    CONSTRAINT PK_etapas_discipulado PRIMARY KEY (id),
    CONSTRAINT FK_etapas_iglesia FOREIGN KEY (iglesia_id) REFERENCES iglesias(id)
);

-- ============================================================
-- 7. MIEMBROS
--    Perfil completo de cada persona en la congregación
-- ============================================================
CREATE TABLE miembros (
    id                      INT IDENTITY(1,1)   NOT NULL,
    iglesia_id              INT                 NOT NULL,
    usuario_id              INT                 NULL,       -- NULL si no tiene acceso al sistema
    etapa_discipulado_id    INT                 NULL,
    -- Datos personales
    nombre                  NVARCHAR(100)       NOT NULL,
    apellido                NVARCHAR(100)       NOT NULL,
    fecha_nacimiento        DATE                NULL,
    genero                  NCHAR(1)            NULL,       -- 'M', 'F'
    estado_civil            NVARCHAR(20)        NULL,       -- 'soltero','casado','viudo','divorciado'
    foto_url                NVARCHAR(500)       NULL,
    -- Contacto
    email                   NVARCHAR(150)       NULL,
    telefono                NVARCHAR(30)        NULL,
    telefono_emergencia     NVARCHAR(30)        NULL,
    direccion               NVARCHAR(300)       NULL,
    -- Membresía
    fecha_ingreso           DATE                NULL,
    fecha_bautismo          DATE                NULL,
    es_bautizado            BIT                 NOT NULL DEFAULT 0,
    es_activo               BIT                 NOT NULL DEFAULT 1,
    -- Notas pastorales
    notas                   NVARCHAR(MAX)       NULL,
    creado_en               DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    actualizado_en          DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_miembros PRIMARY KEY (id),
    CONSTRAINT FK_miembros_iglesia      FOREIGN KEY (iglesia_id)            REFERENCES iglesias(id),
    CONSTRAINT FK_miembros_usuario      FOREIGN KEY (usuario_id)            REFERENCES usuarios(id),
    CONSTRAINT FK_miembros_etapa        FOREIGN KEY (etapa_discipulado_id)  REFERENCES etapas_discipulado(id)
);

-- ============================================================
-- 8. MIEMBRO_DISCIPULADO
--    Historial de seguimiento espiritual por miembro
-- ============================================================
CREATE TABLE miembro_discipulado (
    id                      INT IDENTITY(1,1)   NOT NULL,
    miembro_id              INT                 NOT NULL,
    mentor_usuario_id       INT                 NULL,       -- Usuario que hace el seguimiento
    etapa_discipulado_id    INT                 NOT NULL,
    fecha_inicio            DATE                NOT NULL,
    fecha_fin               DATE                NULL,       -- NULL = etapa actual
    notas                   NVARCHAR(MAX)       NULL,
    creado_en               DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_miembro_discipulado PRIMARY KEY (id),
    CONSTRAINT FK_md_miembro    FOREIGN KEY (miembro_id)            REFERENCES miembros(id),
    CONSTRAINT FK_md_mentor     FOREIGN KEY (mentor_usuario_id)     REFERENCES usuarios(id),
    CONSTRAINT FK_md_etapa      FOREIGN KEY (etapa_discipulado_id)  REFERENCES etapas_discipulado(id)
);

-- ============================================================
-- 9. GRUPOS
--    Grupos pequeños, células, departamentos
-- ============================================================
CREATE TABLE grupos (
    id              INT IDENTITY(1,1)   NOT NULL,
    iglesia_id      INT                 NOT NULL,
    lider_id        INT                 NULL,       -- miembro_id del líder
    nombre          NVARCHAR(150)       NOT NULL,
    tipo            NVARCHAR(50)        NOT NULL DEFAULT 'celula', -- 'celula','departamento','ministerio'
    descripcion     NVARCHAR(300)       NULL,
    lugar_reunion   NVARCHAR(200)       NULL,
    dia_reunion     NVARCHAR(20)        NULL,       -- 'lunes', 'martes', etc.
    hora_reunion    TIME                NULL,
    activo          BIT                 NOT NULL DEFAULT 1,
    creado_en       DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    actualizado_en  DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_grupos PRIMARY KEY (id),
    CONSTRAINT FK_grupos_iglesia    FOREIGN KEY (iglesia_id)    REFERENCES iglesias(id),
    CONSTRAINT FK_grupos_lider      FOREIGN KEY (lider_id)      REFERENCES miembros(id)
);

-- ============================================================
-- 10. GRUPO_MIEMBRO
--     N:M entre grupos y miembros
-- ============================================================
CREATE TABLE grupo_miembro (
    id              INT IDENTITY(1,1)   NOT NULL,
    grupo_id        INT                 NOT NULL,
    miembro_id      INT                 NOT NULL,
    fecha_ingreso   DATE                NOT NULL DEFAULT CAST(GETUTCDATE() AS DATE),
    fecha_salida    DATE                NULL,
    activo          BIT                 NOT NULL DEFAULT 1,
    CONSTRAINT PK_grupo_miembro PRIMARY KEY (id),
    CONSTRAINT FK_gm_grupo      FOREIGN KEY (grupo_id)      REFERENCES grupos(id),
    CONSTRAINT FK_gm_miembro    FOREIGN KEY (miembro_id)    REFERENCES miembros(id),
    CONSTRAINT UQ_grupo_miembro UNIQUE (grupo_id, miembro_id)
);

-- ============================================================
-- 11. ASISTENCIA
--     Cabecera: un registro por evento/fecha
-- ============================================================
CREATE TABLE asistencia (
    id              INT IDENTITY(1,1)   NOT NULL,
    iglesia_id      INT                 NOT NULL,
    grupo_id        INT                 NULL,       -- NULL = servicio general
    tipo            NVARCHAR(50)        NOT NULL DEFAULT 'servicio', -- 'servicio','celula','evento'
    titulo          NVARCHAR(150)       NULL,       -- 'Domingo 12 ene', 'Célula Norte'
    fecha           DATE                NOT NULL,
    hora_inicio     TIME                NULL,
    registrado_por  INT                 NOT NULL,   -- usuario_id
    notas           NVARCHAR(300)       NULL,
    creado_en       DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_asistencia PRIMARY KEY (id),
    CONSTRAINT FK_asis_iglesia  FOREIGN KEY (iglesia_id)    REFERENCES iglesias(id),
    CONSTRAINT FK_asis_grupo    FOREIGN KEY (grupo_id)      REFERENCES grupos(id),
    CONSTRAINT FK_asis_usuario  FOREIGN KEY (registrado_por) REFERENCES usuarios(id)
);

-- ============================================================
-- 12. ASISTENCIA_DETALLE
--     Una fila por miembro por evento
-- ============================================================
CREATE TABLE asistencia_detalle (
    id              INT IDENTITY(1,1)   NOT NULL,
    asistencia_id   INT                 NOT NULL,
    miembro_id      INT                 NOT NULL,
    presente        BIT                 NOT NULL DEFAULT 1,
    justificado     BIT                 NOT NULL DEFAULT 0,
    notas           NVARCHAR(200)       NULL,
    CONSTRAINT PK_asistencia_detalle PRIMARY KEY (id),
    CONSTRAINT FK_ad_asistencia FOREIGN KEY (asistencia_id) REFERENCES asistencia(id),
    CONSTRAINT FK_ad_miembro    FOREIGN KEY (miembro_id)    REFERENCES miembros(id),
    CONSTRAINT UQ_ad_asistencia_miembro UNIQUE (asistencia_id, miembro_id)
);

-- ============================================================
-- 13. ENSEÑANZAS
--     Biblioteca: sermones, estudios, materiales
-- ============================================================
CREATE TABLE enseñanzas (
    id              INT IDENTITY(1,1)   NOT NULL,
    iglesia_id      INT                 NOT NULL,
    autor_id        INT                 NULL,       -- miembro_id del predicador
    titulo          NVARCHAR(200)       NOT NULL,
    descripcion     NVARCHAR(500)       NULL,
    tipo            NVARCHAR(30)        NOT NULL DEFAULT 'sermon', -- 'sermon','estudio','material'
    fecha           DATE                NULL,
    archivo_url     NVARCHAR(500)       NULL,       -- Azure Blob Storage (audio/video/pdf)
    duracion_min    INT                 NULL,       -- duración en minutos
    tags            NVARCHAR(300)       NULL,       -- separados por coma
    activo          BIT                 NOT NULL DEFAULT 1,
    creado_en       DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_enseñanzas PRIMARY KEY (id),
    CONSTRAINT FK_ens_iglesia   FOREIGN KEY (iglesia_id)    REFERENCES iglesias(id),
    CONSTRAINT FK_ens_autor     FOREIGN KEY (autor_id)      REFERENCES miembros(id)
);

-- ============================================================
-- 14. CATEGORIAS_FINANCIERAS
--     Catálogo configurable por iglesia
-- ============================================================
CREATE TABLE categorias_financieras (
    id          INT IDENTITY(1,1)   NOT NULL,
    iglesia_id  INT                 NOT NULL,
    nombre      NVARCHAR(100)       NOT NULL,
    tipo        NCHAR(1)            NOT NULL,   -- 'I'=Ingreso, 'E'=Egreso
    descripcion NVARCHAR(200)       NULL,
    activo      BIT                 NOT NULL DEFAULT 1,
    CONSTRAINT PK_categorias_financieras PRIMARY KEY (id),
    CONSTRAINT FK_cf_iglesia    FOREIGN KEY (iglesia_id) REFERENCES iglesias(id),
    CONSTRAINT CK_cf_tipo       CHECK (tipo IN ('I', 'E'))
);

-- Datos semilla de categorías
-- (se insertan vacías, cada iglesia define las suyas)

-- ============================================================
-- 15. FINANZAS_INGRESO
--     Diezmos, ofrendas y otras entradas
-- ============================================================
CREATE TABLE finanzas_ingreso (
    id              INT IDENTITY(1,1)   NOT NULL,
    iglesia_id      INT                 NOT NULL,
    categoria_id    INT                 NULL,
    miembro_id      INT                 NULL,       -- NULL = anónimo
    registrado_por  INT                 NOT NULL,   -- usuario_id
    monto           DECIMAL(12,2)       NOT NULL,
    moneda          NCHAR(3)            NOT NULL DEFAULT 'GTQ',
    fecha           DATE                NOT NULL,
    descripcion     NVARCHAR(300)       NULL,
    comprobante_url NVARCHAR(500)       NULL,       -- Azure Blob
    creado_en       DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_finanzas_ingreso PRIMARY KEY (id),
    CONSTRAINT FK_fi_iglesia    FOREIGN KEY (iglesia_id)    REFERENCES iglesias(id),
    CONSTRAINT FK_fi_categoria  FOREIGN KEY (categoria_id)  REFERENCES categorias_financieras(id),
    CONSTRAINT FK_fi_miembro    FOREIGN KEY (miembro_id)    REFERENCES miembros(id),
    CONSTRAINT FK_fi_usuario    FOREIGN KEY (registrado_por) REFERENCES usuarios(id),
    CONSTRAINT CK_fi_monto      CHECK (monto > 0)
);

-- ============================================================
-- 16. FINANZAS_EGRESO
--     Gastos categorizados
-- ============================================================
CREATE TABLE finanzas_egreso (
    id              INT IDENTITY(1,1)   NOT NULL,
    iglesia_id      INT                 NOT NULL,
    categoria_id    INT                 NULL,
    registrado_por  INT                 NOT NULL,   -- usuario_id
    monto           DECIMAL(12,2)       NOT NULL,
    moneda          NCHAR(3)            NOT NULL DEFAULT 'GTQ',
    fecha           DATE                NOT NULL,
    descripcion     NVARCHAR(300)       NOT NULL,
    beneficiario    NVARCHAR(150)       NULL,
    comprobante_url NVARCHAR(500)       NULL,       -- Azure Blob
    creado_en       DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_finanzas_egreso PRIMARY KEY (id),
    CONSTRAINT FK_fe_iglesia    FOREIGN KEY (iglesia_id)    REFERENCES iglesias(id),
    CONSTRAINT FK_fe_categoria  FOREIGN KEY (categoria_id)  REFERENCES categorias_financieras(id),
    CONSTRAINT FK_fe_usuario    FOREIGN KEY (registrado_por) REFERENCES usuarios(id),
    CONSTRAINT CK_fe_monto      CHECK (monto > 0)
);

-- ============================================================
-- ÍNDICES DE RENDIMIENTO
-- ============================================================

-- Asistencia: consultas frecuentes por iglesia y fecha
CREATE INDEX IX_asistencia_iglesia_fecha     ON asistencia(iglesia_id, fecha DESC);
CREATE INDEX IX_asistencia_detalle_miembro   ON asistencia_detalle(miembro_id);

-- Miembros: búsqueda por iglesia
CREATE INDEX IX_miembros_iglesia             ON miembros(iglesia_id);
CREATE INDEX IX_miembros_email               ON miembros(email) WHERE email IS NOT NULL;

-- Finanzas: reportes por período
CREATE INDEX IX_fi_iglesia_fecha             ON finanzas_ingreso(iglesia_id, fecha DESC);
CREATE INDEX IX_fe_iglesia_fecha             ON finanzas_egreso(iglesia_id, fecha DESC);

-- Grupos
CREATE INDEX IX_grupos_iglesia               ON grupos(iglesia_id);
CREATE INDEX IX_grupo_miembro_miembro        ON grupo_miembro(miembro_id);

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
