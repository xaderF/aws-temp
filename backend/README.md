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
python3 -m venv .venv
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

## AWS RDS Connection

Set `DATABASE_URL` in `backend/.env`:

```bash
DATABASE_URL="postgresql://utransit_admin:<password>@<rds-endpoint>:5432/utransit?sslmode=require"
```

Then start the API and run seed script.
