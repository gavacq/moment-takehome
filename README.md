# Battery Voltage Monitoring System

A full-stack application for storing and visualizing time series battery voltage data.

## DEMO
https://www.loom.com/share/963151d1260149bbb4de53dcaac709d3

## Tech Stack

**Frontend:**
- React 19
- TypeScript 5.9
- Vite (Rolldown)
- Tailwind CSS v4
- Recharts
- shadcn/ui

**Backend:**
- Node.js v22
- Express 5
- TypeScript 5.9
- Drizzle ORM
- PostgreSQL 16
- Winston (logging)
- Vitest (testing)
- Zod (validation)

**DevOps:**
- Docker & Docker Compose
- pnpm 10.12.1

## Features

- Real-time voltage chart with time range selection (1m, 15m, 1hr, 6hr, 12hr)
- REST API for voltage measurements
- PostgreSQL database with automated seeding
- Containerized development environment


## Quick Start

### Using Docker (Recommended)

```bash
# Start all services (PostgreSQL, backend, frontend)
docker compose up

# Access the application at http://localhost:5173
# API available at http://localhost:3000
```

To stop:
```bash
docker compose down
```

### Manual Setup

**Prerequisites:** Node.js v22, pnpm 10.12.1, PostgreSQL

```bash
# Install dependencies
pnpm install

# Backend setup
cd backend
pnpm db:generate   # Generate migrations
pnpm db:migrate    # Apply migrations
pnpm db:seed       # Seed with 24h of data
pnpm dev          # Start backend (port 3000)
pnpm test         # Run tests

# Frontend setup (in new terminal)
cd frontend
pnpm dev          # Start frontend (port 5173)
```

## API Endpoints

### `POST /api/measurements`
Store a voltage measurement.

```json
{
  "voltage": 3.5,
  "timestamp": "2026-01-11T13:00:00.000Z"
}
```

### `GET /api/measurements`
Query measurements within a time range.

**Query Parameters:**
- `start` (optional): ISO timestamp
- `end` (optional): ISO timestamp

**Returns:** Array of measurements ordered by timestamp

### `POST /api/measurements/reseed`
Regenerate 24 hours of mock data with current timestamps.

## Development

### Database
- PostgreSQL 16 with single `measurements` table
- Seeded with 24 hours of sawtooth wave data (0V→5V→0V, 10s intervals)
- Managed via Drizzle ORM

### Scripts
```bash
pnpm db:seed       # Reseed database
pnpm post-data     # Simulate live data posting
```

### Testing
```bash
cd backend
pnpm test
```

## Deployment to Render.com

This project includes a `render.yaml` blueprint file for easy deployment to Render.com.

### Prerequisites
- A [Render.com](https://render.com) account
- A GitHub repository with this code

### Deployment Steps

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Add Render.com blueprint"
   git push origin main
   ```

2. **Create a new Blueprint Instance on Render:**
   - Go to your [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Select the repository containing this project
   - Render will automatically detect the `render.yaml` file

3. **Review and Deploy:**
   - Review the services that will be created:
     - `moment-takehome-db` - PostgreSQL database
     - `moment-takehome-backend` - Backend API service
     - `moment-takehome-frontend` - Frontend static site
   - Click "Apply" to create all services

4. **Wait for Deployment:**
   - The database will be created first
   - The backend will build, run migrations, and seed the database
   - The frontend will build and deploy
   - This may take 5-10 minutes for the first deployment

5. **Access Your Application:**
   - Once deployed, you'll receive URLs for both services
   - The frontend URL will be something like: `https://moment-takehome-frontend.onrender.com`
   - The backend URL will be something like: `https://moment-takehome-backend.onrender.com`

6. **Configure Frontend API URL (IMPORTANT):**
   - Go to the `moment-takehome-frontend` service in your Render Dashboard
   - Navigate to "Environment" tab
   - Add a new environment variable:
     - Key: `VITE_API_URL`
     - Value: `https://moment-takehome-backend.onrender.com/api` (use your actual backend URL)
   - Click "Save Changes"
   - The frontend will automatically redeploy with the correct API URL

### Post-Deployment

#### Reseed Data
To refresh the database with current timestamps after deployment:

```bash
curl -X POST https://moment-takehome-backend.onrender.com/api/measurements/reseed
```

#### Environment Variables
The blueprint automatically configures:
- `DATABASE_URL` - Connected to the PostgreSQL database
- `VITE_API_URL` - Frontend points to the backend API
- `PORT` - Backend runs on port 3000
- `NODE_ENV` - Set to production

#### Monitoring
- Check service logs in the Render Dashboard
- Health check endpoint: `https://moment-takehome-backend.onrender.com/health`

### Updating Your Deployment

To deploy updates:
```bash
git add .
git commit -m "Your update message"
git push origin main
```

Render will automatically detect the changes and redeploy your services.

### Cost Considerations
- The blueprint uses "starter" plans for all services
- Free tier is available but services may spin down after inactivity
- Upgrade to paid plans for always-on services and better performance

