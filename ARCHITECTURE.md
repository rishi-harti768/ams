# AMS Codebase Architecture

This document provides a high-level overview of the AMS (Academic Management System) architecture, technology stack, and project structure.

## Overview

AMS is a modern, type-safe Academic Management System built as a monorepo using **Turborepo** and **Bun**. It leverages **Next.js** for the frontend and **oRPC** for an end-to-end type-safe API layer, backed by **PostgreSQL** and **Drizzle ORM**.

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Monorepo** | [Turborepo](https://turbo.build/repo), [Bun Workspaces](https://bun.sh/docs/install/workspaces) |
| **Frontend** | [Next.js 16](https://nextjs.org/) (App Router), [Tailwind CSS v4](https://tailwindcss.com/) |
| **API** | [oRPC](https://orpc.sh/) (End-to-end type-safety via OpenAPI) |
| **Database** | [PostgreSQL](https://www.postgresql.org/), [Drizzle ORM](https://orm.drizzle.team/) |
| **Auth** | [Better Auth](https://www.better-auth.com/) |
| **Validation** | [Zod](https://zod.dev/) |
| **Styling/UI** | [shadcn/ui](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/) |
| **Quality** | [Ultracite](https://github.com/AmanVarshney01/ultracite) (Biome-based linting/formatting) |

## Project Structure

The project follows a modular monorepo structure under `apps/` and `packages/`:

### Applications (`apps/`)

- **`web/`**: The main Next.js application.
  - `src/app/`: Next.js App Router pages and layouts.
  - `src/components/`: App-specific UI components.
  - `src/utils/orpc.ts`: oRPC client configuration for both Server and Client Components.

### Packages (`packages/`)

- **`api/`**: The backend API layer.
  - `src/routers/`: oRPC router definitions (admin, cgpa, profile, score, etc.).
  - `src/context.ts`: API context (session, user).
- **`auth/`**: Authentication configuration using Better Auth.
- **`db/`**: Database schema, relations, and client initialization.
  - `src/schema/`: Drizzle schema definitions (ams.ts for domain, auth.ts for auth).
- **`ui/`**: Shared UI component library based on shadcn/ui.
- **`env/`**: Type-safe environment variable validation using Zod.
- **`config/`**: Shared configuration for TypeScript and linting.

## Data Flow

### API Requests (oRPC)

1. **Client**: Frontend calls a procedure using the `orpc` client (e.g., `orpc.score.getScores.useQuery(...)`).
2. **Transport**: Request is sent via HTTP Fetch to `/api/rpc`.
3. **Server**: The oRPC router in `packages/api` receives the request.
4. **Validation**: Input is validated using Zod schemas defined in the router.
5. **Logic**: Procedures interact with the database using Drizzle ORM.
6. **Response**: Type-safe response is returned to the client.

### Authentication

- Powered by **Better Auth** with a Drizzle adapter.
- **Server-side**: Session validation occurs in Next.js middleware and oRPC context.
- **Client-side**: `auth-client.ts` provides hooks for managing login, signup, and user state.
- **Plugins**: Includes `admin` plugin for role-based access control.

## Database Schema

The domain schema (`packages/db/src/schema/ams.ts`) includes:
- **Academic Profile**: Links users to their academic data.
- **Semesters**: Tracks academic terms and target SGPAs.
- **Subjects**: Defines courses within a semester.
- **Scores**: Stores marks/grades for specific subjects.

## Design System

The project uses a unified design system:
- **`packages/ui`**: Contains primitive components (Button, Card, Input, etc.).
- **`apps/web`**: Consumes shared primitives and implements complex page layouts.
- **Tailwind CSS v4**: Uses the latest utility-first CSS engine for high-performance styling.

## Development Workflow

- **Installation**: `bun install`
- **Development**: `bun run dev` (runs all apps and packages in parallel via Turbo)
- **Database**:
  - `bun run db:push`: Sync schema to DB.
  - `bun run db:studio`: Visual database explorer.
- **Quality**:
  - `bun run check`: Linting and formatting via Ultracite.
  - `bun run fix`: Auto-fix linting/formatting issues.
