# Takehome challenge for Moment Energy Fullstack Developer position

## Description

This is a takehome challenge for the Moment Energy Fullstack Developer position. The challenge is to create a web app that stores and visualizes time series voltage data from a battery.

## Technologies

- React latest
- TypeScript latest
- shadcn ui latest
- tailwindcss v4
- shadcn charts latest
- Node.js v22.12.0
- Express latest
- drizzle-orm latest
- hosting on render.com
- pnpm v10.12.1

## API

### Endpoints

#### POST /api/measurements
Receive and store a voltage measurement, consisting of both a voltage and a timestamp.

**Request Body:**
```json
{
  "voltage": 3.5,
  "timestamp": "2026-01-11T13:00:00.000Z"
}
```

#### GET /api/measurements
Query voltage measurements within a time range.

**Query Parameters:**
- `start` (optional): ISO 8601 timestamp - get measurements after this time
- `end` (optional): ISO 8601 timestamp - get measurements before this time

**Response:** Array of measurement objects with voltage and timestamp, ordered by timestamp.

#### POST /api/measurements/reseed
Repopulate the database with 24 hours of mock data ending at the current time. Useful for demos.

**Response:**
```json
{
  "message": "Database reseeded successfully",
  "recordsCreated": 8640,
  "startTime": "2026-01-10T13:00:00.000Z",
  "endTime": "2026-01-11T13:00:00.000Z"
}
```



## Database

- A postgres database shall be used to store the voltage measurements.
- The database shall have a single table, called "measurements", with the following columns:
  - id (integer, primary key)
  - voltage (float)
  - timestamp (datetime)
- https://render.com/docs/postgresql

### Seeding
The developed database should contain mocked voltage data taken over the last 24 hours,
measured at an interval of 10s. The voltage measurements should start at 0V, and be
incremented by 0.01V every timestep until 5V is reached. Once 5V is reached, the voltage
should be decremented by 0.01V every timestep until 0V is reached. Repeat the process until
24 hours' worth of data is populated.
You will likely require a simple script to populate the database.

## Deployment

- https://render.com/articles/how-to-deploy-full-stack-applications-without-devops-expertise1


## UI
- [insert wireframes here]
As a user I can:
1) Select a time range from a drop-down menu with the following options:
● 1m
● 15m
● 1hr
● 6hr
● 12hr
2) Refresh the voltage chart using the selected time range via a refresh button.

## Other requirements
- add basic logging
- add basic testing with vitest

## How to Run Locally

### Option 1: Docker Compose (Recommended)

#### Prerequisites
- Docker and Docker Compose

#### Steps

1.  **Start all services:**
    ```bash
    docker compose up
    ```
    
    This will:
    - Start PostgreSQL database
    - Run database migrations and seed data
    - Start the backend API on `http://localhost:3000`
    - Start the frontend on `http://localhost:5173`

2.  **Open the App:**
    - Open your browser and visit `http://localhost:5173`

3.  **Stop services:**
    ```bash
    docker compose down
    ```

4.  **Clean up (remove database volume):**
    ```bash
    docker compose down -v
    ```

### Option 2: Manual Setup

#### Prerequisites
- Node.js v22.12.0
- pnpm v10.12.1
- PostgreSQL database

#### Steps

1.  **Install dependencies:**
    ```bash
    pnpm install
    ```

2.  **Setup Backend:**
    - Navigate to `backend` directory: `cd backend`
    - Create a `.env` file (copy from `.env.example`) and configure your `DATABASE_URL`.
    - Generate migration files:
      ```bash
      pnpm db:generate
      ```
    - Apply migrations:
      ```bash
      pnpm db:migrate
      ```
    - Seed the database:
      ```bash
      pnpm db:seed
      ```
    - Start the backend server:
      ```bash
      pnpm dev
      ```
    - Run tests:
        ```bash
        pnpm test
        ```

3.  **Setup Frontend:**
    - Navigate to `frontend` directory: `cd frontend`
    - Start the development server:
      ```bash
      pnpm dev
      ```

4.  **Open the App:**
    - Open your browser and visit `http://localhost:5173`.

## Demo Features

### Reseed Data for Demo
To refresh the database with current timestamps (useful before a demo):

```bash
curl -X POST http://localhost:3000/api/measurements/reseed
```

Or from the backend directory:
```bash
cd backend
pnpm db:seed
```

### Post Live Data
To demonstrate the refresh functionality with live data being added:

```bash
cd backend
pnpm post-data
```

This will continuously post new voltage measurements every 10 seconds. Leave it running in a separate terminal, then use the refresh button in the UI to see new data appear.

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
   - The frontend will automatically connect to the backend via the configured `VITE_API_URL`

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

