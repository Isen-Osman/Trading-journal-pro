# Trading Journal Pro

A full-stack trading journal with trade logging and performance analytics.

## Tech Stack

- **Backend:** FastAPI, SQLAlchemy, Pydantic (Python 3.13)
- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Database:** PostgreSQL 13 with pgAdmin 4
- **Containerization:** Docker Compose

## Quick Start (Docker)

From the project root:

```bash
docker compose up -d
```

On the first run, or after changing application code / dependencies:

```bash
docker compose up -d --build
```

Useful commands:

```bash
docker compose ps                 # service status
docker compose logs -f backend    # follow backend logs
docker compose down               # stop and remove containers
docker compose down -v            # also delete the database volume
```

### Services and URLs

| Service  | URL / Host                | Credentials                          |
| -------- | ------------------------- | ------------------------------------ |
| Frontend | http://localhost:3001     | —                                    |
| API      | http://localhost:8001     | Swagger docs at `/docs`              |
| pgAdmin  | http://localhost:8888     | `admin@admin.com` / `admin`          |
| Postgres | `localhost:5433`          | `user` / `password` / `trading_journal` |

Ports `3000` and `8000` are already used by other projects on this machine, so the frontend and API are published as `3001` and `8001`. Inside the Compose network the backend listens on `8000` and Postgres on `5432`; edit `docker-compose.yml` if you want different host ports.

The database is stored in the named volume `postgres_data`, so `docker compose down` keeps your data. `docker compose down -v` deletes it.

### Seed Data

The database contains 18 sample trades for the user `Isenn` (14 closed, 4 open) so the trade log and analytics pages are populated. If you recreate the volume, log in again and add your own trades.

## Local Development (without Docker)

Start only the database and pgAdmin:

```bash
docker compose up -d db pgadmin
```

Backend:

```bash
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Set `DATABASE_URL` in `.env` to the published Postgres port:

```env
DATABASE_URL=postgresql://user:password@localhost:5433/trading_journal
```

Then run:

```bash
uvicorn app.main:app --reload
```

Frontend (note the nested directory):

```bash
cd frontend/frontend
npm install
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1 npm run dev
```

Open http://localhost:3000. The API URL defaults to `http://localhost:8000/api/v1` when `NEXT_PUBLIC_API_URL` is not set; in Docker it is baked at build time from `build.args.NEXT_PUBLIC_API_URL`.

## API Endpoints

| Method | Endpoint                  | Description                          |
| ------ | ------------------------- | ------------------------------------ |
| POST   | `/api/v1/auth/register`   | Create a user                        |
| POST   | `/api/v1/auth/login`      | Get a bearer token                   |
| GET    | `/api/v1/trades/`         | List the current user's trades       |
| POST   | `/api/v1/trades/`         | Create a trade                       |
| GET    | `/api/v1/analytics/summary` | PnL, trade count and win/loss stats |

All `/trades` and `/analytics` routes require `Authorization: Bearer <token>`.

## Project Structure

```text
.
├── app/                     # FastAPI backend
│   ├── api/v1/routes/       # auth, trades, analytics
│   ├── core/                # config, database, security
│   ├── models/              # SQLAlchemy models
│   ├── schemas/             # Pydantic schemas
│   ├── services/            # business logic
│   └── main.py              # app entrypoint
├── frontend/frontend/       # Next.js application (nested)
│   ├── src/app/             # pages
│   ├── src/components/      # shared UI
│   ├── src/context/         # auth context
│   └── src/lib/api.ts       # axios client
├── tests/                   # backend tests
├── docker-compose.yml
├── Dockerfile               # backend image
├── frontend/frontend/Dockerfile
└── requirements.txt
```

Database tables are created automatically by `Base.metadata.create_all()` on backend startup; no migration step is required.

## Tests

```bash
DATABASE_URL=sqlite:///./test_db.db pytest
```

## Troubleshooting

- **UI looks unstyled:** hard-refresh the browser (`Cmd+Shift+R`) to drop the cached CSS.
- **Port already allocated:** another project is using the host port; change the mapping in `docker-compose.yml`.
- **`version` warning from Compose:** harmless, the key is kept for older Compose compatibility.
