# melamina-saas-backend

Backend SaaS multi-tenant para empresas de servicios de melamina.

## Stack
Node.js · Express · TypeScript · Prisma · PostgreSQL · JWT

## Setup

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Scripts

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor en modo desarrollo con hot reload (tsx) |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Ejecuta el servidor compilado |
| `npm run prisma:migrate` | Ejecuta migraciones de Prisma |
| `npm run lint` | Lint con ESLint |
| `npm run format` | Formatea con Prettier |

## Estructura

```
src/
├── modules/          # Módulos por feature
│   ├── auth/
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
└── server.ts         # Entry point
```

## Endpoints

- `GET /health` – Health check
