-- ============================================================
-- Control-Church: Seed de datos demo
-- Password para TODOS los usuarios: Demo1234!
-- Hash bcrypt: $2b$10$jdT14rjrrEVe/UCL3PyCjeHon2CuaxOrhtRoHYEVOW09OnSH1/WDS
-- ============================================================

-- ============================================================
-- 1. ROLES (si no existen)
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM roles_usuario WHERE nombre = 'superadmin')
BEGIN
    INSERT INTO roles_usuario (nombre, descripcion, nivel) VALUES
    ('superadmin',    'Administrador global del sistema',    1),
    ('pastor',        'Pastor principal de la iglesia',      2),
    ('administrador', 'Administrador de la iglesia',         3),
    ('lider_grupo',   'Lider de grupo o celula',             5),
    ('miembro',       'Miembro regular',                     10);
END;
GO

-- ============================================================
-- 2. ORGANIZACION DEMO
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM organizaciones WHERE nombre = 'Iglesia Verbo Guatemala')
BEGIN
    INSERT INTO organizaciones (nombre, descripcion, pais)
    VALUES ('Iglesia Verbo Guatemala', 'Comunidad cristiana evangelica Verbo', 'Guatemala');
END;
GO

DECLARE @org_id INT = (SELECT TOP 1 id FROM organizaciones WHERE nombre = 'Iglesia Verbo Guatemala');

-- ============================================================
-- 3. IGLESIAS DEMO (sede principal + 2 sucursales)
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM iglesias WHERE nombre = 'Verbo Central' AND organizacion_id = @org_id)
BEGIN
    INSERT INTO iglesias (organizacion_id, nombre, direccion, ciudad, pais, email)
    VALUES (@org_id, 'Verbo Central', 'Zona 10, Ciudad de Guatemala', 'Guatemala', 'Guatemala', 'central@verbo.gt');
END;

DECLARE @iglesia_central INT = (SELECT TOP 1 id FROM iglesias WHERE nombre = 'Verbo Central' AND organizacion_id = @org_id);

IF NOT EXISTS (SELECT 1 FROM iglesias WHERE nombre = 'Verbo Villa Nueva' AND organizacion_id = @org_id)
BEGIN
    INSERT INTO iglesias (organizacion_id, iglesia_padre_id, nombre, direccion, ciudad, pais, email)
    VALUES (@org_id, @iglesia_central, 'Verbo Villa Nueva', 'Boulevard principal, Villa Nueva', 'Villa Nueva', 'Guatemala', 'villanueva@verbo.gt');
END;

IF NOT EXISTS (SELECT 1 FROM iglesias WHERE nombre = 'Verbo Mixco' AND organizacion_id = @org_id)
BEGIN
    INSERT INTO iglesias (organizacion_id, iglesia_padre_id, nombre, direccion, ciudad, pais, email)
    VALUES (@org_id, @iglesia_central, 'Verbo Mixco', 'Calzada San Juan, Mixco', 'Mixco', 'Guatemala', 'mixco@verbo.gt');
END;
GO

-- ============================================================
-- 4. USUARIOS DEMO
--    Password: Demo1234!
-- ============================================================
DECLARE @hash NVARCHAR(255) = '$2b$10$jdT14rjrrEVe/UCL3PyCjeHon2CuaxOrhtRoHYEVOW09OnSH1/WDS';

-- SuperAdmin (tuLogro)
IF NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'admin@tulogro.dev')
    INSERT INTO usuarios (email, nombre, apellido, password_hash) VALUES ('admin@tulogro.dev', 'Admin', 'tuLogro', @hash);

-- Pastor principal
IF NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'admin@verbo.gt')
    INSERT INTO usuarios (email, nombre, apellido, password_hash) VALUES ('admin@verbo.gt', 'Carlos', 'Pastor', @hash);

-- Administrador de iglesia
IF NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'admin.central@verbo.gt')
    INSERT INTO usuarios (email, nombre, apellido, password_hash) VALUES ('admin.central@verbo.gt', 'Maria', 'Administradora', @hash);

-- Lider de grupo
IF NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'lider@verbo.gt')
    INSERT INTO usuarios (email, nombre, apellido, password_hash) VALUES ('lider@verbo.gt', 'Pedro', 'Lider', @hash);

-- Miembro regular
IF NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'miembro@verbo.gt')
    INSERT INTO usuarios (email, nombre, apellido, password_hash) VALUES ('miembro@verbo.gt', 'Ana', 'Miembro', @hash);
GO

-- ============================================================
-- 5. ASIGNAR ROLES POR IGLESIA
-- ============================================================
DECLARE @org_id2 INT = (SELECT TOP 1 id FROM organizaciones WHERE nombre = 'Iglesia Verbo Guatemala');
DECLARE @iglesia_c INT = (SELECT TOP 1 id FROM iglesias WHERE nombre = 'Verbo Central' AND organizacion_id = @org_id2);
DECLARE @iglesia_vn INT = (SELECT TOP 1 id FROM iglesias WHERE nombre = 'Verbo Villa Nueva' AND organizacion_id = @org_id2);

DECLARE @uid_super INT = (SELECT id FROM usuarios WHERE email = 'admin@tulogro.dev');
DECLARE @uid_pastor INT = (SELECT id FROM usuarios WHERE email = 'admin@verbo.gt');
DECLARE @uid_admin INT = (SELECT id FROM usuarios WHERE email = 'admin.central@verbo.gt');
DECLARE @uid_lider INT = (SELECT id FROM usuarios WHERE email = 'lider@verbo.gt');
DECLARE @uid_miembro INT = (SELECT id FROM usuarios WHERE email = 'miembro@verbo.gt');

DECLARE @rol_super INT = (SELECT id FROM roles_usuario WHERE nombre = 'superadmin');
DECLARE @rol_pastor INT = (SELECT id FROM roles_usuario WHERE nombre = 'pastor');
DECLARE @rol_admin INT = (SELECT id FROM roles_usuario WHERE nombre = 'administrador');
DECLARE @rol_lider INT = (SELECT id FROM roles_usuario WHERE nombre = 'lider_grupo');
DECLARE @rol_miembro INT = (SELECT id FROM roles_usuario WHERE nombre = 'miembro');

-- SuperAdmin tiene acceso a todas las iglesias
IF NOT EXISTS (SELECT 1 FROM usuario_iglesia_rol WHERE usuario_id = @uid_super AND iglesia_id = @iglesia_c)
    INSERT INTO usuario_iglesia_rol (usuario_id, iglesia_id, rol_id) VALUES (@uid_super, @iglesia_c, @rol_super);
IF NOT EXISTS (SELECT 1 FROM usuario_iglesia_rol WHERE usuario_id = @uid_super AND iglesia_id = @iglesia_vn)
    INSERT INTO usuario_iglesia_rol (usuario_id, iglesia_id, rol_id) VALUES (@uid_super, @iglesia_vn, @rol_super);

-- Pastor en iglesia central
IF NOT EXISTS (SELECT 1 FROM usuario_iglesia_rol WHERE usuario_id = @uid_pastor AND iglesia_id = @iglesia_c)
    INSERT INTO usuario_iglesia_rol (usuario_id, iglesia_id, rol_id) VALUES (@uid_pastor, @iglesia_c, @rol_pastor);

-- Admin en iglesia central
IF NOT EXISTS (SELECT 1 FROM usuario_iglesia_rol WHERE usuario_id = @uid_admin AND iglesia_id = @iglesia_c)
    INSERT INTO usuario_iglesia_rol (usuario_id, iglesia_id, rol_id) VALUES (@uid_admin, @iglesia_c, @rol_admin);

-- Lider en iglesia central
IF NOT EXISTS (SELECT 1 FROM usuario_iglesia_rol WHERE usuario_id = @uid_lider AND iglesia_id = @iglesia_c)
    INSERT INTO usuario_iglesia_rol (usuario_id, iglesia_id, rol_id) VALUES (@uid_lider, @iglesia_c, @rol_lider);

-- Miembro en iglesia central
IF NOT EXISTS (SELECT 1 FROM usuario_iglesia_rol WHERE usuario_id = @uid_miembro AND iglesia_id = @iglesia_c)
    INSERT INTO usuario_iglesia_rol (usuario_id, iglesia_id, rol_id) VALUES (@uid_miembro, @iglesia_c, @rol_miembro);
GO

-- ============================================================
-- 6. ETAPAS DE DISCIPULADO DEMO (para Verbo Central)
-- ============================================================
DECLARE @org_id3 INT = (SELECT TOP 1 id FROM organizaciones WHERE nombre = 'Iglesia Verbo Guatemala');
DECLARE @ig_c INT = (SELECT TOP 1 id FROM iglesias WHERE nombre = 'Verbo Central' AND organizacion_id = @org_id3);

IF NOT EXISTS (SELECT 1 FROM etapas_discipulado WHERE iglesia_id = @ig_c AND nombre = 'Nuevo creyente')
BEGIN
    INSERT INTO etapas_discipulado (iglesia_id, nombre, descripcion, orden) VALUES
    (@ig_c, 'Nuevo creyente',    'Recien convertido, primeros pasos',     1),
    (@ig_c, 'Fundamentos',       'Curso de fundamentos de la fe',         2),
    (@ig_c, 'Discipulado 1',     'Primer nivel de discipulado',           3),
    (@ig_c, 'Discipulado 2',     'Segundo nivel de discipulado',          4),
    (@ig_c, 'Lider en formacion','Preparacion para liderazgo',            5),
    (@ig_c, 'Lider activo',      'Lider de celula o ministerio',          6);
END;
GO

-- ============================================================
-- 7. CATEGORIAS FINANCIERAS DEMO
-- ============================================================
DECLARE @org_id4 INT = (SELECT TOP 1 id FROM organizaciones WHERE nombre = 'Iglesia Verbo Guatemala');
DECLARE @ig_c2 INT = (SELECT TOP 1 id FROM iglesias WHERE nombre = 'Verbo Central' AND organizacion_id = @org_id4);

IF NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE iglesia_id = @ig_c2 AND nombre = 'Diezmos')
BEGIN
    INSERT INTO categorias_financieras (iglesia_id, nombre, tipo, descripcion) VALUES
    (@ig_c2, 'Diezmos',            'ingreso', 'Diezmos de los miembros'),
    (@ig_c2, 'Ofrendas',           'ingreso', 'Ofrendas regulares del servicio'),
    (@ig_c2, 'Ofrendas especiales','ingreso', 'Ofrendas de campanas o eventos'),
    (@ig_c2, 'Donaciones',         'ingreso', 'Donaciones externas'),
    (@ig_c2, 'Alquiler',           'egreso',  'Alquiler del local'),
    (@ig_c2, 'Servicios basicos',  'egreso',  'Agua, luz, internet, telefono'),
    (@ig_c2, 'Materiales',         'egreso',  'Materiales de ensenanza y oficina'),
    (@ig_c2, 'Salarios',           'egreso',  'Salarios del personal'),
    (@ig_c2, 'Misiones',           'egreso',  'Apoyo a misioneros y proyectos');
END;
GO

PRINT '== Seed completado exitosamente ==';
PRINT 'Usuarios demo (password: Demo1234!):';
PRINT '  admin@tulogro.dev      -> SuperAdmin';
PRINT '  admin@verbo.gt         -> Pastor';
PRINT '  admin.central@verbo.gt -> Administrador';
PRINT '  lider@verbo.gt         -> Lider de grupo';
PRINT '  miembro@verbo.gt       -> Miembro';
GO
