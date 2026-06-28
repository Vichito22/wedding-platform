## Overview

Wedding platform with a public guest-facing gift registry and an admin area to manage gifts. Monorepo with two independently deployed apps (Railway): `apps/frontend` (Next.js 16, App Router, React 19, Tailwind v4) and `apps/backend` (FastAPI + SQLAlchemy + PostgreSQL).

## Commands

Backend (`apps/backend`):
- Run dev server: `uvicorn app.main:app --reload` (serves on `:8000`)
- Install deps: `pip install -r requirements.txt`
- No test suite or linter is configured yet.

Frontend (`apps/frontend`):
- Dev: `npm run dev` (`:3000`) · Build: `npm run build` · Prod: `npm start`
- Lint: `npm run lint` (ESLint flat config, `eslint-config-next`)
- No test suite is configured yet.

Local Postgres: `docker compose up -d` from the repo root starts only the database (host port **5433** → container 5432). The frontend and backend are run directly (not in compose). The root `docker-compose.yml` does **not** build the app images.

## Architecture

### Backend layering
Requests flow **route → service → model**, and this separation is enforced:
- `app/routes/` — FastAPI routers (thin). Each module exposes a `router`; they are re-exported from `app/routes/__init__.py` and registered in `app/main.py`. Routes do HTTP concerns (status codes, cookies, dependency injection) and delegate logic.
- `app/services/` — business logic (auth, gifts, admin bootstrap). No FastAPI imports here.
- `app/models/` — SQLAlchemy ORM models using the typed `Mapped[...]` / `mapped_column` style, inheriting the shared `Base` from `app/db/connection.py`.
- `app/schemas/` — Pydantic request/response models (`response_model=...` on routes).

Tables are created at startup via `Base.metadata.create_all` (see `create_all_tables` + the `startup` event in `main.py`) — there is **no migration tool** (no Alembic). Adding a model requires it to be imported before `create_all_tables` runs; `main.py` imports `app.models` for this reason, and new models must be wired into `app/models/__init__.py`. Schema changes to existing tables are NOT applied automatically by `create_all`.

On startup the app also calls `seed_admin_if_needed`, which creates the admin row from `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` only if both are set and the admin does not already exist.

### Auth model
Admin-only auth using a **JWT stored in an httponly cookie** (`admin_session`):
- `POST /admin/auth/login` validates credentials (`pbkdf2_sha256` via passlib) and sets the cookie; `/logout` clears it; `/session` returns the current admin.
- Protected backend routes depend on `get_current_admin` (in `routes/auth.py`), which reads and decodes the cookie. Reuse this dependency to guard new admin endpoints.
- The frontend `middleware.ts` gates routes by **presence** of the cookie only (redirects `/admin/*` → `/login` when missing, and `/login` → `/admin` when present). It does not validate the token — actual validation happens server-side on each API call.
- Gift endpoints are split by access: `/admin/gifts` (auth required, in `admin_gifts.py`) vs public read-only `/gifts` (`public_gifts.py`). Both list via the same `list_gifts` service.

### Frontend API access
All backend calls go through `apiFetch` in `app/utils/api.ts`, which prefixes `NEXT_PUBLIC_API_URL`, sends `credentials: "include"` (required for the auth cookie), and throws a typed `ApiError` carrying the HTTP status and backend `detail` message. Add new API calls as wrappers (see `app/utils/auth.ts`) rather than calling `fetch` directly. `NEXT_PUBLIC_API_URL` is required at build time and the module throws if it is unset.

## Configuration & conventions

- Backend config is centralized in `app/config.py` (`pydantic-settings`, reads `apps/backend/.env`). Required: `DATABASE_URL`. Notable: `cors_origins` accepts a comma-separated string and is parsed into a list; cookie behavior is controlled by `AUTH_COOKIE_SECURE` / `AUTH_COOKIE_SAMESITE` (set secure cookies in production with a cross-site `samesite` as appropriate).
- CORS `allow_origins` is explicit and must include each frontend origin; `allow_credentials=True` is set so the cookie works cross-origin.
- `DATABASE_URL` is sanitized (stripped, BOM removed) in `db/connection.py` before creating the engine — preserve this when touching connection setup.
- Both apps deploy on Railway with the backend honoring the `$PORT` env var (see `apps/backend/Dockerfile` CMD). Health endpoints: `/health` (app) and `/db-health` (DB connectivity, returns 503 on failure).
