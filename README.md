# FII Espacios

Guia web de espacios de la Facultad de Ingenieria Industrial de la Universidad de Guayaquil. La aplicacion permite consultar bloques, aulas, laboratorios y espacios de interes, y cuenta con autenticacion para administrar usuarios.

## Estado Actual

- Aplicacion desplegada en Vercel: `https://fii-espacios.vercel.app`
- Base de datos remota: Prisma Postgres en Vercel
- Autenticacion: Auth.js / NextAuth con credenciales
- Usuario inicial creado por seed:
  - Usuario: `admin`
  - Contrasena inicial: `admin1234`

Cambia la contrasena inicial despues del primer inicio de sesion.

## Stack

- Next.js `16.2.7`
- React `19.2.4`
- TypeScript
- Tailwind CSS `4`
- Prisma ORM `7.8.0`
- Prisma Postgres
- `@prisma/adapter-pg`
- Auth.js / NextAuth `5 beta`
- bcryptjs
- Vercel
- GitHub Actions para despliegue opcional

## Estructura

```txt
.
|-- prisma/
|   |-- migrations/
|   |-- schema.prisma
|   `-- seed.ts
|-- public/
|-- src/
|   |-- app/
|   |   |-- admin/usuarios/
|   |   |-- api/auth/[...nextauth]/
|   |   |-- bloques/
|   |   |-- espacios/
|   |   |-- login/
|   |   |-- layout.tsx
|   |   `-- page.tsx
|   |-- components/
|   |-- data/
|   |-- lib/
|   |   |-- auth.ts
|   |   `-- prisma.ts
|   `-- types/
|-- .github/workflows/vercel-deploy.yml
|-- .env.example
|-- next.config.ts
|-- package.json
`-- prisma.config.ts
```

## Rutas Principales

| Ruta | Descripcion |
| --- | --- |
| `/` | Inicio de la guia |
| `/login` | Inicio de sesion |
| `/bloques` | Listado de bloques |
| `/bloques/[id]` | Detalle de un bloque |
| `/espacios` | Busqueda/listado de espacios |
| `/espacios/[id]` | Detalle de un espacio |
| `/admin/usuarios` | Administracion de usuarios |
| `/admin/usuarios/[id]` | Edicion de usuario |
| `/api/auth/[...nextauth]` | Endpoints de Auth.js |

## Variables De Entorno

Crea un archivo `.env.local` localmente o usa `vercel env pull` despues de conectar el proyecto a Vercel.

```env
AUTH_SECRET=""
DATABASE_URL="postgres://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
SEED_ADMIN_USERNAME="admin"
SEED_ADMIN_PASSWORD=""
```

Variables opcionales:

```env
NEXTAUTH_SECRET=""
NEXTAUTH_URL=""
```

Notas:

- `AUTH_SECRET` es la variable recomendada para Auth.js v5.
- `NEXTAUTH_SECRET` no es necesario si `AUTH_SECRET` existe.
- `NEXTAUTH_URL` normalmente no es necesario en Vercel, salvo que necesites fijar una URL canonica.
- No subas `.env.local` al repositorio.

Para generar un `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

## Instalacion Local

Requisitos:

- Node.js compatible con Next.js 16
- npm
- Acceso a una base Postgres remota, idealmente Prisma Postgres en Vercel

Instala dependencias:

```bash
npm install
```

Genera Prisma Client:

```bash
npx prisma generate
```

Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

Abre:

```txt
http://localhost:3000
```

## Base De Datos

El proyecto usa Prisma Postgres. El datasource en `prisma/schema.prisma` esta configurado como:

```prisma
datasource db {
  provider = "postgresql"
}
```

El cliente Prisma se genera en:

```txt
src/generated/prisma
```

Ese directorio no se versiona porque se genera automaticamente con:

```bash
npx prisma generate
```

## Migraciones

Para aplicar migraciones en la base remota:

```bash
npm run db:migrate:deploy
```

Las migraciones actuales crean:

- Enum `Role`
- Tabla `User`
- Indice unico para `username`

## Seed

Para crear el usuario administrador inicial:

```bash
npm run db:seed
```

Valores por defecto:

```txt
SEED_ADMIN_USERNAME=admin
SEED_ADMIN_PASSWORD=admin1234
```

Puedes definir una contrasena segura antes de ejecutar el seed.

PowerShell:

```powershell
$env:SEED_ADMIN_USERNAME="admin"
$env:SEED_ADMIN_PASSWORD="una-contrasena-segura"
npm run db:seed
```

macOS/Linux:

```bash
SEED_ADMIN_USERNAME="admin" SEED_ADMIN_PASSWORD="una-contrasena-segura" npm run db:seed
```

## Scripts

| Script | Uso |
| --- | --- |
| `npm run dev` | Inicia Next.js en desarrollo |
| `npm run build` | Genera Prisma Client y compila produccion |
| `npm run start` | Inicia la app compilada |
| `npm run lint` | Ejecuta ESLint |
| `npm run db:migrate:deploy` | Aplica migraciones Prisma en la DB |
| `npm run db:seed` | Crea/actualiza el admin inicial |
| `npm run postinstall` | Genera Prisma Client despues de instalar |

## Despliegue En Vercel

Configuracion recomendada:

| Opcion | Valor |
| --- | --- |
| Framework Preset | Next.js |
| Root Directory | `./` |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | Next.js default |

Pasos:

1. Importa el repositorio en Vercel.
2. Crea una base en `Storage > Prisma Postgres`.
3. Conecta la base al proyecto.
4. Verifica que Vercel cree `DATABASE_URL`.
5. Configura `AUTH_SECRET`.
6. Descarga variables localmente:

```bash
vercel env pull
```

7. Aplica migraciones:

```bash
npm run db:migrate:deploy
```

8. Crea el admin:

```bash
npm run db:seed
```

9. Despliega:

```bash
vercel deploy --prod
```

## GitHub Actions

El workflow publico esta en:

```txt
.github/workflows/vercel-deploy.yml
```

Permite que cualquier fork configure sus propios secretos y despliegue en Vercel.

Secretos requeridos en GitHub:

```env
VERCEL_TOKEN=
VERCEL_ORG_ID=
VERCEL_PROJECT_ID=
DATABASE_URL=
AUTH_SECRET=
```

El workflow solo despliega a produccion si pasan todas las validaciones:

1. Instala dependencias.
2. Genera Prisma Client.
3. Verifica que existan los secrets requeridos.
4. Ejecuta lint.
5. Ejecuta build local.
6. Aplica migraciones.
7. Hace build con Vercel.
8. Despliega el output precompilado.

Si cualquiera de esos pasos falla, no se publica una nueva version de produccion.

## Seguridad

- No subas `.env.local`.
- Cambia la contrasena inicial `admin1234`.
- Manten `AUTH_SECRET` solo en Vercel/GitHub Secrets.
- Usa una base remota; no uses SQLite local en Vercel.
- Revisa logs despues de cada despliegue:

```bash
vercel logs https://fii-espacios.vercel.app --expand --since 30m
```

## Verificacion

Comandos recomendados antes de desplegar:

```bash
npm run lint
npm run build
npm run db:migrate:deploy
```

Prueba de produccion:

```bash
vercel curl https://fii-espacios.vercel.app/login
```

## Notas De Mantenimiento

- El proyecto usa `proxy.ts` para proteger rutas con Auth.js.
- Las rutas de administracion requieren usuario con rol `ADMIN`.
- Los datos de bloques y espacios estan en `src/data`.
- Prisma 7 requiere driver adapter; este proyecto usa `@prisma/adapter-pg`.
- `next.config.ts` fija `turbopack.root` para evitar problemas por lockfiles externos.
