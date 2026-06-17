# melamina-saas-backend

Backend SaaS multi-tenant para empresas de servicios de melamina.

## Stack
Node.js · Express · TypeScript · Prisma · PostgreSQL · JWT

## Setup inicial

Requisitos: Node >= 20, Docker Desktop.

```bash
npm install
cp .env.example .env
docker compose up -d              # levanta Postgres dev en localhost:5432
npx prisma migrate deploy         # aplica migraciones a la DB local
npm run prisma:seed               # crea el SUPER_ADMIN local
npm run dev                       # servidor en localhost:3000
```

Credenciales del SUPER_ADMIN local: `superadmin@melaminapro.com` + la contraseña definida en `SUPER_ADMIN_PASSWORD` del `.env`.

## Flujo de cambios en la base de datos

1. Editas `prisma/schema.prisma`.
2. Generas la migración localmente:
   ```bash
   npm run prisma:migrate -- --name <descripcion_del_cambio>
   ```
   Esto crea `prisma/migrations/<timestamp>_<descripcion>/migration.sql`, lo aplica a la DB local y regenera el cliente Prisma.
3. Commit + push del schema y la migración:
   ```bash
   git add prisma/
   git commit -m "feat(db): <descripcion>"
   git push
   ```
4. Railway aplica `prisma migrate deploy` automáticamente en el redeploy. Si la migración falla, el server no arranca.

**Importante:** nunca corras `prisma db push` ni `prisma migrate dev` apuntando a producción. El `.env` local debe apuntar siempre al Postgres de Docker.

## Scripts

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor en modo desarrollo con hot reload (tsx) |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | `prisma migrate deploy && prisma db seed && node dist/server.js` (usado por Railway) |
| `npm run prisma:migrate` | Crea y aplica una nueva migración en local |
| `npm run prisma:deploy` | Aplica migraciones pendientes sin crear nuevas |
| `npm run prisma:seed` | Ejecuta el seeder (idempotente) |
| `npm run lint` | Lint con ESLint |
| `npm run format` | Formatea con Prettier |

## Estructura

```
src/
├── modules/          # Módulos por feature
│   ├── auth/
│   ├── users/
│   ├── config/
│   ├── staff/
│   ├── clients/
│   ├── warehouse/
│   └── projects/
├── shared/           # Código compartido
│   ├── config/       # env, prisma client
│   ├── middlewares/
│   ├── types/
│   └── utils/
├── app.ts            # Configuración Express
├── server.ts         # Entry point
└── seed.ts           # Seeder (compilado a dist/seed.js)
```

## Endpoints

- `GET /health` – Health check
- `POST /api/auth/register` – Registro de tenant + ADMIN
- `POST /api/auth/login` – Login
- `GET /api/auth/me` – Usuario actual (requiere Bearer token)
- `GET|POST|PATCH|DELETE /api/users` – CRUD de empleados (solo ADMIN, BUSINESS)
