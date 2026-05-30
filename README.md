# Hospital Juan Pablo II - Plataforma de Seguridad del Paciente

Sistema full stack en Next.js 15 para gestion de incidentes, eventos adversos, tecnovigilancia, analisis causa raiz, acciones CAPA, indicadores, auditoria y reportes.

## Arquitectura

- Next.js 15 App Router con Server Components, Server Actions y Route Handlers.
- Prisma ORM sobre MySQL 8.
- Auth.js con JWT, adapter Prisma, RBAC por roles y permisos.
- UI con TailwindCSS y componentes estilo shadcn/ui.
- Validaciones compartidas con Zod y React Hook Form.
- Graficas con Recharts y tablas previstas con TanStack Table.
- Ejecucion como aplicacion Next.js full stack sobre Node.js y MySQL.

## Estructura

```text
app/                  Rutas App Router, layouts, Route Handlers
components/           Componentes UI y layout global
config/               Permisos, constantes y configuracion de dominio
lib/                  Prisma, autorizacion y utilidades transversales
modules/              Modulos por dominio: auth, incidents, dashboard, etc.
prisma/               Schema, migraciones y seed
services/             Servicios de aplicacion e integraciones
types/                Tipos globales y augmentations
utils/                Helpers puros
```

## Modelo entidad-relacion

Entidades principales:

- `User`, `Role`, `Permission`, `RolePermission`
- `Area`, `Service`
- `IncidentReport`, `PatientInfo`, `DeviceInfo`, `ReporterInfo`, `IncidentOutcome`
- `RootCauseAnalysis`, `IshikawaCategory`, `FiveWhy`
- `SafetyAction`
- `BiomedicalEquipment`, `Maintenance`
- `Evidence`, `Attachment`, `Notification`, `AuditLog`, `Indicator`
- Tablas Auth.js: `Account`, `Session`, `VerificationToken`

Las relaciones normalizan el formato institucional: el reporte conserva datos de institucion, evento y estado; paciente, dispositivo y reportante viven en tablas 1:1; desenlaces, evidencias, timeline, cambios, CAPA y causa raiz son relaciones 1:N.

## Roles iniciales

- Administrador
- Personal asistencial
- Comite de seguridad
- Ingenieria biomedica
- Coordinador

## Desarrollo local

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Configura `DATABASE_URL` para apuntar a una instancia MySQL disponible en tu entorno local o servidor.

Usuario seed:

```text
admin@hospitaljuanpabloii.gov.co
Admin12345!
```

## Roadmap

1. Hito 1: arquitectura base, Prisma, Auth.js, RBAC, dashboard y wizard oficial de incidentes.
2. Hito 2: tablas reales con TanStack Table, filtros, detalle de incidente, timeline y evidencias.
3. Hito 3: analisis causa raiz con Ishikawa y 5 porques, acciones CAPA y notificaciones.
4. Hito 4: inventario biomedico, mantenimientos y reportes de tecnovigilancia.
5. Hito 5: exportacion PDF/Excel, indicadores institucionales y endurecimiento de seguridad.

## Produccion

```bash
npm ci
npm run db:deploy
npm run build
npm run start
```
