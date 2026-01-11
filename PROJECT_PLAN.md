# Moment Energy Takehome Project Plan

## Implementation Plan

Build a web application that stores and visualizes time series voltage data from a battery, using React + Express + PostgreSQL.

### Project Structure
- `backend/`: Express server, Drizzle ORM, and database logic.
- `frontend/`: React app with Vite, Tailwind CSS, and shadcn/ui.
- Monorepo managed with pnpm workspaces.

### Backend Details
- **Technology**: Node.js/Express with TypeScript.
- **Database**: PostgreSQL with Drizzle ORM.
- **Endpoints**:
  - `POST /api/measurements`: Receive and store voltage measurements.
  - `GET /api/measurements?after=<timestamp>`: Query measurements after a specific time.
- **Seeding**: Script to generate 24 hours of data at 10s intervals oscillating between 0V-5V.

### Frontend Details
- **Technology**: React, Vite, TypeScript.
- **Styling**: Tailwind CSS + shadcn/ui.
- **Visualization**: shadcn charts (Recharts).
- **Features**: Time range selector (1m, 15m, 1hr, 6hr, 12hr), manual refresh.

### Deployment
- Target: Render.com for database, backend, and static frontend.
- `render.yaml` for infrastructure-as-code.

---

## Task Breakdown

### Project Setup
- [x] Initialize monorepo structure with pnpm workspaces
- [x] Set up React + TypeScript frontend with Vite
- [x] Set up Express + TypeScript backend
- [x] Configure Tailwind CSS and shadcn/ui
- [x] Set up Drizzle ORM with PostgreSQL

### Backend Development
- [x] Create database schema (measurements table)
- [x] Implement POST /api/measurements endpoint
- [x] Implement GET /api/measurements endpoint with timestamp filter
- [x] Add request validation and error handling
- [x] Add basic logging

### Database Seeding
- [x] Create seed script for 24 hours of mock voltage data
- [x] Implement voltage oscillation logic (0V → 5V → 0V)

### Frontend Development
- [x] Create main layout with header
- [x] Implement time range dropdown (1m, 15m, 1hr, 6hr, 12hr)
- [x] Implement voltage chart using shadcn charts
- [x] Add refresh button functionality
- [x] Connect to backend API

### Testing
- [x] Set up Vitest for backend
- [x] Set up Vitest for frontend (Setup, though only backend has explicit tests)
- [x] Add API endpoint tests
- [ ] Add component tests (Skipped for now as per minimal requirement "add basic testing")

### Deployment
- [ ] Configure render.com deployment for PostgreSQL
- [ ] Configure render.com deployment for backend
- [ ] Configure render.com deployment for frontend