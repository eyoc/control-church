# Control-Church — Contexto del Proyecto

## Identidad
- **Producto:** Control-Church
- **Lema:** "Conecta. Crece. Sirve."
- **Tipo:** SaaS de gestión para iglesias evangélicas pequeñas y medianas (hasta ~1000 miembros)
- **Subdominio:** control-church.tulogro.dev

## Stack Tecnológico
| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js + TypeScript (plantilla Minimal Kit) — carpeta `frontend/` |
| Backend | NestJS + TypeORM — carpeta `backend/` |
| Base de datos | SQL Server en Azure (plan Serverless Free) |
| Archivos/fotos | Azure Blob Storage |
| Auth | JWT + Google OAuth |
| Deploy Frontend | Vercel |

## Estado Actual
- `frontend/` → plantilla Minimal Kit instalada con `npm install`
- `backend/` → plantilla NestJS instalada, **SIN módulos ni código de negocio aún**
- Base de datos → scripts SQL creados (ver abajo), **pendiente verificar estado en Azure**

## Reglas de Desarrollo

### Base de Datos
- `synchronize: false` en TypeORM **siempre**. Las tablas se manejan con scripts SQL manuales.
- Los Stored Procedures se usan para reportes complejos y operaciones críticas (ej: correlativos de recibos).
- Nunca incrementar `correlativo_recibo` desde la aplicación — solo via SP `sp_siguiente_correlativo_recibo`.
- País: Guatemala — moneda `GTQ` — ente tributario: SAT — identificador fiscal: NIT.

### NestJS
- Un módulo por entidad de negocio (organizaciones, iglesias, usuarios, miembros, grupos, asistencia, finanzas, ensenanzas).
- Separación estricta: `*.controller.ts` → HTTP, `*.service.ts` → lógica, `*.entity.ts` → mapeo ORM.
- DTOs con `class-validator` para toda entrada de datos.
- Guards JWT en todas las rutas excepto auth.
- Prefijo global de rutas: `/api`.

### Nomenclatura
- Base de datos: `snake_case` (columnas y tablas en español).
- TypeScript: `camelCase` para propiedades, con `@Column({ name: 'nombre_columna' })` para el mapeo.
- Archivos: `kebab-case.entity.ts`, `kebab-case.service.ts`, etc.

## Estructura de Carpetas del Backend

```
backend/
├── src/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   └── google.strategy.ts
│   │   └── guards/
│   │       └── jwt-auth.guard.ts
│   ├── common/
│   │   ├── decorators/
│   │   │   └── iglesia-actual.decorator.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   └── interceptors/
│   ├── database/
│   │   └── sp.service.ts          ← servicio genérico para ejecutar SPs
│   ├── organizaciones/
│   ├── iglesias/
│   ├── usuarios/
│   ├── miembros/
│   ├── grupos/
│   ├── asistencia/
│   ├── finanzas/
│   ├── ensenanzas/
│   ├── app.module.ts
│   └── main.ts
├── .env
└── .env.example
```

## Tablas en la Base de Datos (16 tablas)

### Núcleo / Multi-tenant
| Tabla | Descripción |
|-------|-------------|
| `organizaciones` | Razón social / denominación madre |
| `iglesias` | Congregaciones (soporta sucursales via `iglesia_padre_id`) |
| `roles_usuario` | Catálogo: superadmin, pastor, administrador, lider_grupo, miembro |
| `usuarios` | Acceso al sistema (JWT + Google OAuth) |
| `usuario_iglesia_rol` | N:M — qué rol tiene cada usuario en cada iglesia |

### Membresía y Discipulado
| Tabla | Descripción |
|-------|-------------|
| `etapas_discipulado` | Catálogo configurable por iglesia |
| `miembros` | Perfil completo de cada persona |
| `miembro_discipulado` | Historial de seguimiento espiritual |

### Grupos y Asistencia
| Tabla | Descripción |
|-------|-------------|
| `grupos` | Grupos pequeños, células, departamentos |
| `grupo_miembro` | N:M entre grupos y miembros |
| `asistencia` | Cabecera del evento (fecha, tipo, grupo) |
| `asistencia_detalle` | Una fila por miembro por evento |

### Contenido y Finanzas
| Tabla | Descripción |
|-------|-------------|
| `enseñanzas` | Biblioteca: sermones, estudios, materiales |
| `categorias_financieras` | Catálogo configurable por iglesia (I/E) |
| `finanzas_ingreso` | Diezmos, ofrendas — con campos fiscales NIT/SAT |
| `finanzas_egreso` | Gastos categorizados |

### Campos Fiscales Guatemala (en organizaciones e iglesias)
- `nit` — NIT ante la SAT
- `razon_social_fiscal` — nombre registrado en SAT
- `direccion_fiscal`
- `regimen_fiscal` — `'Pequeño Contribuyente'` | `'General IVA'` | `'Exento'`
- `es_emisor_facturas` — si es `false`, hereda NIT de la organización madre
- `tipo_documento` — `'recibo_interno'` | `'recibo_nit'` | `'ambos'`
- `prefijo_recibo` + `correlativo_recibo` — numeración propia por sucursal

### Campos fiscales en finanzas_ingreso
- `numero_recibo` — generado por SP (ej: `'IGN-000123'`)
- `nit_donante` — `'CF'` si es Consumidor Final
- `nombre_fiscal`
- `tipo_documento_emitido`

## Variables de Entorno (.env)

```env
# Base de datos Azure SQL
DB_HOST=tu-server.database.windows.net
DB_PORT=1433
DB_DATABASE=control_church
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
DB_ENCRYPT=true

# JWT
JWT_SECRET=tu_secreto_super_seguro
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=https://control-church.tulogro.dev/api/auth/google/callback

# Azure Blob Storage
AZURE_STORAGE_ACCOUNT=
AZURE_STORAGE_KEY=
AZURE_STORAGE_CONTAINER=control-church

# App
PORT=3001
NODE_ENV=development
```

## Stored Procedures Existentes
- `sp_siguiente_correlativo_recibo @iglesia_id, @numero_recibo OUTPUT` — genera el siguiente número de recibo con bloqueo de fila (UPDLOCK/ROWLOCK) para evitar duplicados.

## Módulos MVP (en orden de prioridad)
1. **Auth** — JWT + Google OAuth, guard global
2. **Organizaciones + Iglesias** — CRUD base, multi-tenant
3. **Usuarios + Roles** — asignación de roles por iglesia
4. **Miembros** — CRUD completo con foto (Azure Blob)
5. **Grupos** — CRUD + asignación de miembros
6. **Asistencia** — registro rápido móvil + analíticas (SP)
7. **Finanzas** — ingresos/egresos + emisión de recibos
8. **Enseñanzas** — biblioteca de contenido

## Comandos Útiles

```bash
# Backend
cd backend
npm run start:dev       # desarrollo con hot reload
npm run build           # compilar
npm run test            # unit tests

# Frontend
cd frontend
npm run dev             # desarrollo
npm run build           # compilar para Vercel
```

## Notas Importantes
- Las iglesias evangélicas en Guatemala generalmente son **Exentas de IVA** (Decreto 20-2006).
- El campo `nit_donante` siempre debe ser `'CF'` (Consumidor Final) si el donante no proporciona NIT — nunca dejar vacío en recibos.
- `password_hash` en `usuarios` tiene `select: false` en TypeORM — nunca se devuelve en queries normales.
- El sistema es **multi-tenant**: toda query de negocio debe filtrar por `iglesia_id`.
