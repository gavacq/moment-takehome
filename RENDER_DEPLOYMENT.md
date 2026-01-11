# Render.com Deployment Configuration

This document provides details about the Render.com blueprint configuration for the Moment Energy Takehome project.

## Services Overview

### 1. PostgreSQL Database (`moment-takehome-db`)
- **Type**: PostgreSQL database (defined in `databases:` section)
- **Plan**: Starter
- **Region**: Oregon
- **Database Name**: `moment_takehome`
- **Database User**: `moment_user`

### 2. Backend API (`moment-takehome-backend`)
- **Type**: Web service
- **Runtime**: Node.js
- **Plan**: Starter
- **Region**: Oregon
- **Build Command**:
  - Enables pnpm via corepack
  - Installs dependencies with frozen lockfile
  - Builds TypeScript to JavaScript
  - Generates Drizzle migration files
- **Start Command**:
  - Runs database migrations
  - Seeds the database with 24 hours of mock data
  - Starts the Express server
- **Environment Variables**:
  - `NODE_ENV=production`
  - `PORT=3000`
  - `DATABASE_URL` (auto-connected from database)
- **Health Check**: `/health` endpoint

### 3. Frontend Static Site (`moment-takehome-frontend`)
- **Type**: Static site
- **Runtime**: Static
- **Plan**: Starter
- **Region**: Oregon
- **Build Command**:
  - Enables pnpm via corepack
  - Installs dependencies with frozen lockfile
  - Builds React app with Vite
- **Publish Directory**: `frontend/dist`
- **Environment Variables**:
  - `VITE_API_URL` (automatically set to `${moment-takehome-backend.url}/api`)
- **Routing**: SPA routing with rewrite rules for client-side routing

## Deployment Flow

1. **Database Creation**: PostgreSQL database is provisioned first
2. **Backend Deployment**:
   - Dependencies installed
   - TypeScript compiled
   - Migrations generated and applied
   - Database seeded with mock data
   - Server starts and health check passes
3. **Frontend Deployment**:
   - Dependencies installed
   - Vite build runs with backend URL injected
   - Static files deployed
   - SPA routing configured

## Important Notes

### Database Migrations
- Migrations are automatically run on every deployment via the start command
- The database is seeded with fresh data on each deployment
- To preserve data between deployments, comment out the seed command

### Environment Variables
- All environment variables are automatically configured via the blueprint
- The frontend's `VITE_API_URL` is automatically set to `${moment-takehome-backend.url}/api`
- The backend's `DATABASE_URL` is automatically connected to the PostgreSQL database
- No manual configuration needed after initial deployment

### Monorepo Support
- The blueprint handles the pnpm workspace structure
- Build commands run from the workspace root
- Each service builds only its required dependencies

### Cost Optimization
- All services use the "starter" plan
- Consider upgrading to paid plans for:
  - Always-on services (free tier spins down after inactivity)
  - Better performance
  - More resources

## Troubleshooting

### Build Failures
- Check that pnpm version matches `packageManager` in package.json
- Verify all dependencies are in pnpm-lock.yaml
- Review build logs in Render Dashboard

### Database Connection Issues
- Ensure `DATABASE_URL` environment variable is properly connected
- Check database service is running
- Verify IP allow list settings if needed

### Frontend API Connection
- Verify `VITE_API_URL` is set correctly
- Check CORS configuration in backend
- Ensure backend health check is passing

## Manual Overrides

If you need to customize the deployment:

1. **Skip Database Seeding**: Remove `pnpm db:seed` from the backend start command
2. **Change Region**: Update `region` field for each service
3. **Upgrade Plans**: Change `plan` from `starter` to `standard` or higher
4. **Add IP Restrictions**: Add IP addresses to `ipAllowList` for the database

## Updating the Blueprint

After modifying `render.yaml`:
1. Commit and push changes to GitHub
2. Render will detect changes automatically
3. Review and apply updates in the Render Dashboard

Alternatively, you can manually update services in the Render Dashboard without modifying the blueprint.
