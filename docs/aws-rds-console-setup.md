# AWS Console Setup: PostgreSQL for UTransit

This guide sets up Amazon RDS PostgreSQL and connects it to the Python backend in `backend/`.

## 1. Create the DB in AWS Console

1. Open AWS Console -> `RDS` -> `Databases` -> `Create database`.
2. Choose `Standard create`.
3. Engine type: `PostgreSQL`.
4. Template: `Free tier` (or `Dev/Test` if free tier is unavailable).
5. DB instance identifier: `utransit-postgres`.
6. Master username: `utransit_admin`.
7. Set a strong master password and save it.
8. DB instance class: `db.t3.micro` (or smallest available).
9. Storage: `20 GiB` General Purpose SSD.
10. Under Connectivity:
- Choose your VPC (default is fine for hackathon).
- Public access: `Yes` (fastest for hackathon).
- VPC security group: create new or select existing.
11. Initial database name: `utransit`.
12. Create database.

## 2. Allow your machine to connect

1. Go to `EC2` -> `Security Groups`.
2. Open the security group attached to the RDS instance.
3. Inbound rules -> `Edit inbound rules`.
4. Add rule:
- Type: `PostgreSQL`
- Port: `5432`
- Source: `My IP` (recommended for hackathon) or specific CIDR.
5. Save rules.

## 3. Copy endpoint and build connection string

1. In RDS database details, copy `Endpoint` and `Port` (usually `5432`).
2. Build URL:

```text
postgresql://utransit_admin:<PASSWORD>@<ENDPOINT>:5432/utransit?sslmode=require
```

## 4. Connect backend

From repo root:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and set:

```bash
DATABASE_URL="postgresql://utransit_admin:<PASSWORD>@<ENDPOINT>:5432/utransit?sslmode=require"
```

Install and run:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Optional seed data:

```bash
python -m app.seed
```

## 5. Verify

- Health check: `http://localhost:8000/health`
- Swagger docs: `http://localhost:8000/docs`

## 6. Connect frontend to backend

In the frontend app, set API base URL to:

```text
http://localhost:8000/api/v1
```

If deployed (EC2/ECS), replace with your backend public URL.

## Recommended hackathon security baseline

- Keep DB public only during development/hackathon.
- Restrict security group source to your team IPs, not `0.0.0.0/0`.
- Rotate DB password after demo day.
