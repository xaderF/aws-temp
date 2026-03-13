# UTransit (Temporary Name)

UTransit is a campus-focused transit app concept for University of Toronto students.  
It combines route discovery, trip planning, shuttle access, and wallet/ticket management in one system.

Potential final names:
- UTransit
- BlueTransit
- UFlow

## Problem

UofT students currently use disconnected tools:
- TTC fares: Presto
- Campus shuttle schedules: scattered PDFs
- Live bus info: third-party apps
- Pass/ticket management: no unified student-focused portal

UTransit aims to unify these into a single experience across:
- St. George campus
- Scarborough campus
- Mississauga campus
- Nearby TTC connections

## MVP Goals

### 1. Account
- Email/Google login
- Student ID linking
- Profile management

### 2. Route Explorer
- Campus route map
- Stops and schedule visibility
- Nearest stop + next arrival

### 3. Trip Planner
- Start + destination input
- Route + walking segments + transfers
- Arrival estimates

### 4. Pass + Ticket Wallet
- Student pass
- Guest ticket
- Semester pass
- QR ticket display and validation support

### 5. Ride Tracking
- Current bus location (MVP: schedule-based or driver GPS feed)
- ETA display
- Basic crowding estimate (optional early MVP)

### 6. Trip History
- Recent rides
- Charges/pass usage
- Wallet activity

## Core Product Model (Compass-Inspired)

- Account system: identity, payment methods, usage history, auto-reload
- Transit payment/ticketing: fare or pass validation, zone logic where needed
- Rider history: trips, charges, balance/pass status
- Management portal: fund loading, card/pass freeze, card/pass replacement

## Recommended Stack

### Backend
- Node.js + Fastify
- PostgreSQL
- Prisma
- Redis (caching)
- WebSockets (real-time updates)

### Frontend (Web)
- Next.js
- Tailwind CSS
- Mapbox GL

### Mobile
- React Native + Expo (fast MVP path)

## Service Layout (Initial)

- `auth-service`
- `transit-service`
- `ticket-service`
- `location-service`

Example APIs:
- `GET /routes`
- `GET /routes/:id/stops`
- `GET /stops/:id/arrivals`
- `POST /tickets/purchase`
- `GET /trips/history`

## Initial Data Model

Key tables:
- `users`
- `passes`
- `tickets`
- `routes`
- `stops`
- `buses`
- `trips`
- `payments`

Example fields:

```sql
users (
  id,
  email,
  student_id,
  created_at
)

routes (
  id,
  name,
  campus,
  color
)

stops (
  id,
  name,
  lat,
  lng,
  route_id
)
```

## Real-Time Events

WebSocket channels:
- `bus_location_updates`
- `arrival_updates`

Driver or system feeds may send:
- latitude / longitude
- speed
- route id
- timestamp

## Data Sources

Use GTFS-compatible feeds where available:
- `routes.txt`
- `trips.txt`
- `stop_times.txt`
- `stops.txt`

Possible integrations:
- OpenTripPlanner
- GTFS processing libraries

## MVP Timeline (5 Weeks)

### Week 1
- Product planning
- Database schema
- Route/stop ingestion model

### Week 2
- Core backend APIs
- Arrival prediction baseline

### Week 3
- Web map with route overlays + stop markers

### Week 4
- Wallet, passes, QR tickets, payment wiring

### Week 5
- Mobile MVP (map, trip planner, wallet)

## Longer-Term Features

- Smart fare caps (daily/monthly)
- Student pricing rules engine
- Better crowding prediction
- NFC support (Apple Pay / Google Pay pathways)

## Why This Project Matters

UTransit demonstrates:
- distributed service design
- real-time systems
- geo/transit data modeling
- payment and wallet architecture
- web + mobile product execution

## Status

This repository currently contains product planning documentation for MVP definition and architecture direction.
