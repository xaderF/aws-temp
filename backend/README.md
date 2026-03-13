# UTransit Backend (Python)

FastAPI + SQLAlchemy backend for UTransit.

## Endpoints

- `GET /health`
- `POST /api/v1/users`
- `GET /api/v1/users/{user_id}`
- `GET /api/v1/routes`
- `GET /api/v1/routes/{route_id}/stops`
- `GET /api/v1/stops/{stop_id}/arrivals`
- `POST /api/v1/tickets/purchase`
- `GET /api/v1/trips/history?user_id=<id>&limit=20`

## Local Run

```bash
cd backend
python3.13 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Optional demo data:

```bash
python -m app.seed
```

API docs:

- Swagger: `http://localhost:8000/docs`
- Redoc: `http://localhost:8000/redoc`

## Import Resolution (VS Code)

If VS Code shows `Import ... could not be resolved`, make sure:

1. Backend virtualenv exists and deps are installed:

```bash
cd backend
python3.13 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. You opened the project root (`aws-temp`) so workspace settings apply.
3. VS Code interpreter is `backend/.venv/bin/python` (Command Palette -> `Python: Select Interpreter`).

## AWS RDS Connection

Set `DATABASE_URL` in `backend/.env`:

```bash
DATABASE_URL="postgresql://utransit_admin:<password>@<rds-endpoint>:5432/utransit?sslmode=require"
```

Optional fallback in dev (recommended for hackathons):

```bash
DB_FALLBACK_ENABLED=true
DB_FALLBACK_DATABASE_URL="sqlite:///./utransit.db"
```

Then start the API and run seed script.
