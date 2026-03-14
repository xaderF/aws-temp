# UTransit

UTransit is a hackathon-built transit prototype for the University of Toronto community, designed to unify route discovery, trip planning, and digital ticket management for travel across St. George, Scarborough, and Mississauga.

Built as a working prototype during a hackathon sprint.

## Why UTransit?

UofT transit workflows are fragmented across separate schedules, route lookup tools, and fare systems. UTransit brings core student transit actions into one interface.

## What We Built

- Student registration, login, and authenticated profile flow
- Route browsing and route stop lookup
- Ticket wallet with purchase, listing, and delete actions
- Trip history API and frontend trip/profile/settings pages
- FastAPI backend with SQLAlchemy models and JWT auth
- Prisma schema + PostgreSQL migration tooling
- AWS deployment infrastructure templates and helper scripts

## Product Visuals

![UTransit hero visual](src/assets/hero-tap.png)
![UTransit fare visual](src/assets/basics-fares.jpg)

## Tech Stack Used

- Frontend: Vite, React, TypeScript, React Router, Tailwind CSS, TanStack Query
- Backend: FastAPI, SQLAlchemy, Pydantic, JWT auth
- Database: PostgreSQL (primary), SQLite fallback for local development
- Data tooling: Prisma
- Infra: AWS RDS, ECS/Fargate, S3 + CloudFront, CloudFormation

## Quick Start (Local)

### 1. Start the backend

```bash
cd backend
python3.13 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python -m app.seed
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend docs: `http://localhost:8000/docs`

### 2. Start the frontend

In a new terminal:

```bash
npm install
cp .env.example .env
npm run dev
```

Frontend app: `http://localhost:5173`

## API Scope

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/routes`
- `GET /api/v1/routes/{route_id}/stops`
- `GET /api/v1/tickets`
- `POST /api/v1/tickets/purchase?type=...`
- `DELETE /api/v1/tickets/{ticket_id}`
- `GET /api/v1/trips/history`

## Project Structure

```text
.
├── src/                 # React frontend pages/components/hooks
├── backend/             # FastAPI backend app + routers + seed scripts
├── prisma/              # Prisma schema
├── infra/aws/           # CloudFormation templates (RDS/ECS/S3/CloudFront/CI-CD)
├── scripts/             # Deployment helper scripts
└── docs/                # AWS deployment and setup guides
```

## AWS Deployment Guides

- Full stack deployment: `docs/aws-full-deploy.md`
- RDS setup: `docs/aws-rds-console-setup.md`
- Backend deploy: `docs/aws-backend-deploy.md`
- GitHub CI/CD deploy: `docs/aws-github-cicd-setup.md`

## What's Planned Next

- Live transit feed ingestion and real-time ETA improvements
- Better route search and stop discovery UX
- Expanded fare logic and pass management
- Production hardening for auth, observability, and error monitoring

## Status

Working hackathon prototype with implemented frontend flows, backend APIs, and database/deployment foundations. Not production-ready yet.
