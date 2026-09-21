# Star Institute of Professionals Website

A React + TypeScript + Vite website with a local Express API and SQLite database. The project is self-contained and does not require Supabase or Vercel for local development.

## Requirements

Install **Node.js 22 or newer** and npm. Node 22 is required because the local API uses Node's built-in `node:sqlite` module.

## Run locally in VS Code

1. Open the project folder in VS Code.
2. Open the integrated terminal.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the frontend and API together:

   ```bash
   npm run dev:all
   ```

5. Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

The API runs at `http://localhost:3001`. Vite automatically proxies every `/api/*` request to it, so the React pages and forms work in the same local development session. The SQLite database is created automatically at `data/star-institute.db` the first time the API starts, using `db/schema.sql` and `db/seed.sql`.

If you prefer separate terminals, use `npm run server` in one terminal and `npm run dev` in another.

To preview the production build locally, run `npm run build` followed by `npm run preview:local`, then open `http://localhost:3001`. This uses the complete local SQLite catalogue, including all 31 courses and the fee documents.

## Development admin login

The seeded local administrator is:

| Field | Value |
|---|---|
| Username | `admin` |
| Password | `admin123` |

Change the password before deploying. You can set a different local password with `ADMIN_PASSWORD=your-password npm run server`.

## Database

`db/schema.sql` contains the complete relational schema for courses, news, events, FAQs, staff, gallery, documents, announcements, testimonials, applications, messages, graduation requests, settings and administrator sessions. `db/seed.sql` supplies visible local content so the homepage, course pages, news, events, downloads and admin screens are not empty on first run.

To reset all local data, stop the server and delete `data/star-institute.db`; the next `npm run server` recreates it from the schema and seed files.

## Useful commands

```bash
npm run dev:all  # frontend + API with hot reload
npm run server   # API only
npm run dev      # Vite frontend only
npm run build    # production frontend build
npm run preview:local # production build plus local SQLite API
npm start         # Render server: built frontend plus Supabase API
npm run preview  # preview the production frontend build
```

## Deploy to Render with Supabase

This repository includes `render.yaml` for a single Render web service. The service runs `npm run build`, starts with `npm start`, serves the Vite build, and routes `/api/*` to the Supabase-backed handlers in `api/`.

Create the service from the repository and set these secret/environment values in Render:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable/anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role key; keep secret |
| `ADMIN_PASSWORD` | Production admin password |

Before deploying, run the SQL in `db/schema.sql` and the current seed/content SQL in `db/seed.sql` in the Supabase SQL Editor. The Render health check is `/api/health`.
Before deploying, run `db/supabase-schema.sql` and then `db/supabase-seed.sql` in the Supabase SQL Editor. These are PostgreSQL files for Supabase. Keep `db/schema.sql` and `db/seed.sql` for the local SQLite preview only. The Render health check is `/api/health`.

## Notes

Local development uses `server.js`, which exposes the same `/api/*` paths against SQLite. Render uses `render-server.js` and Supabase instead. Static assets are served from `public/`, including the provided images and PDF downloads.
