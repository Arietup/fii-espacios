# Guía de Despliegue — Espacios FII

Sistema de gestión de espacios de la Facultad de Ingeniería Industrial, Universidad de Guayaquil.
Stack: Next.js 16 · Prisma 7 · PostgreSQL (Prisma Postgres en Vercel) · NextAuth v5

---

## 1. Requisitos previos

| Herramienta | Versión mínima |
|-------------|---------------|
| Node.js     | 20 LTS (recomendado) |
| npm         | 10+ |
| Git         | 2.40+ |
| Vercel CLI  | se instala con `npm i -g vercel` |

---

## 2. Desarrollo local

```bash
# 1. Clonar el repositorio
git clone https://github.com/JuanDavPub/fii-espacios.git
cd fii-espacios

# 2. Instalar dependencias
npm install

# 3. Crear archivo de entorno local
cp .env.example .env.local
# Editar .env.local con los valores reales (ver sección 4)

# 4. Generar Prisma Client
npx prisma generate

# 5. Aplicar migraciones
npx prisma migrate deploy

# 6. (Opcional) Poblar datos iniciales
npm run db:seed

# 7. Iniciar servidor de desarrollo
npm run dev
```

El sitio queda disponible en `http://localhost:3000`.

---

## 3. Variables de entorno requeridas

### `AUTH_SECRET` — NextAuth secret (obligatorio)

Genera un valor seguro con:

```bash
openssl rand -base64 32
```

O visita: https://generate-secret.vercel.app/32

### `DATABASE_URL` — Prisma Postgres

Formato:
```
postgres://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
```

Si usas Vercel Postgres / Prisma Postgres, la URL se obtiene en:
- Vercel Dashboard → tu proyecto → Storage → tu base de datos → `.env.local`

### `VERCEL_TOKEN`

1. Ir a: https://vercel.com/account/tokens
2. Crear un nuevo token con nombre descriptivo (ej: `fii-espacios-ci`)
3. Copiar el valor — solo se muestra una vez

### `VERCEL_ORG_ID`

```bash
# Con Vercel CLI instalado y autenticado:
vercel whoami --token=<tu_token>
# O bien:
cat .vercel/project.json
```

El campo `"orgId"` del archivo `.vercel/project.json` (después de `vercel link`).

### `VERCEL_PROJECT_ID`

```bash
cat .vercel/project.json
# → campo "projectId"
```

---

## 4. Configurar secrets en GitHub Actions

El workflow `.github/workflows/vercel-deploy.yml` requiere que los siguientes
secrets estén configurados **en cada repositorio de GitHub**:

| Secret | Descripción |
|--------|-------------|
| `AUTH_SECRET` | Secret de NextAuth (openssl rand -base64 32) |
| `DATABASE_URL` | URL de conexión a Prisma Postgres |
| `VERCEL_TOKEN` | Token de API de Vercel |
| `VERCEL_ORG_ID` | ID de organización en Vercel |
| `VERCEL_PROJECT_ID` | ID del proyecto en Vercel |

### Pasos para configurar los secrets

**Para el repositorio `JuanDavPub/fii-espacios`:**

1. Ir a: `https://github.com/JuanDavPub/fii-espacios/settings/secrets/actions`
2. Hacer clic en **New repository secret**
3. Agregar cada secret de la tabla anterior con su valor correspondiente

**Para el repositorio `Arietup/fii-espacios`:**

1. Ir a: `https://github.com/Arietup/fii-espacios/settings/secrets/actions`
2. Repetir el mismo proceso

> **Importante:** El error `Missing AUTH_SECRET` en GitHub Actions se resuelve
> únicamente configurando el secret `AUTH_SECRET` en la configuración del
> repositorio. El código del workflow es correcto; el secret simplemente
> no existía en el repositorio.

---

## 5. Variables de entorno en Vercel

En Vercel Dashboard → tu proyecto → Settings → Environment Variables,
configurar para el entorno **Production**:

| Variable | Valor |
|----------|-------|
| `AUTH_SECRET` | El mismo valor que el secret de GitHub |
| `DATABASE_URL` | URL de Prisma Postgres |

> Vercel inyecta automáticamente `VERCEL_URL` y otras variables de sistema.
> `NEXTAUTH_URL` no es requerido con NextAuth v5 cuando `AUTH_SECRET` está
> configurado en Vercel.

---

## 6. Despliegue manual con Vercel CLI

```bash
# Autenticarse
vercel login

# Vincular proyecto (primera vez)
vercel link

# Deploy de producción
vercel --prod
```

---

## 7. Migraciones de base de datos

```bash
# Aplicar migraciones pendientes (producción)
npx prisma migrate deploy

# Crear nueva migración (desarrollo)
npx prisma migrate dev --name descripcion-del-cambio

# Poblar datos iniciales
npm run db:seed

# Abrir Prisma Studio (explorador visual)
npx prisma studio
```

---

## 8. Build y lint

```bash
# Verificar tipos TypeScript + compilar
npm run build

# Lint
npm run lint

# Generar Prisma Client (necesario después de cambios en schema.prisma)
npx prisma generate
```

---

## 9. Flujo de GitHub Actions

El workflow `.github/workflows/vercel-deploy.yml` se activa en cada push a `main`:

1. Valida que todos los secrets estén presentes
2. Instala dependencias con `npm ci`
3. Genera el Prisma Client
4. Ejecuta lint
5. Compila el proyecto (`npm run build`)
6. Aplica migraciones (`prisma migrate deploy`)
7. Hace pull de la configuración de Vercel
8. Build con Vercel CLI
9. Deploy a producción

---

## 10. Repositorios

| Repositorio | URL |
|-------------|-----|
| Principal (docente) | https://github.com/Arietup/fii-espacios |
| Producción (alumno) | https://github.com/JuanDavPub/fii-espacios |

Configurar remotes:

```bash
git remote -v
# origin    → JuanDavPub/fii-espacios (ya configurado)
# upstream  → Arietup/fii-espacios (ya configurado)

# Push a ambos:
git push origin main
git push upstream main
```

---

## 11. Estructura de archivos relevantes

```
fii-espacios/
├── .env.example              # Plantilla de variables de entorno
├── .github/
│   └── workflows/
│       └── vercel-deploy.yml # Pipeline de CI/CD
├── prisma/
│   ├── schema.prisma         # Esquema de la base de datos
│   ├── migrations/           # Historial de migraciones
│   └── seed.ts               # Datos iniciales
├── prisma.config.ts          # Configuración de Prisma CLI
├── src/
│   ├── app/                  # Next.js App Router
│   ├── components/           # Componentes reutilizables
│   └── lib/
│       ├── auth.ts           # Configuración NextAuth v5
│       └── prisma.ts         # Cliente Prisma singleton
└── DEPLOY.md                 # Este archivo
```
