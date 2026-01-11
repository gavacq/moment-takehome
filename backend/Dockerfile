FROM node:22-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.12.1 --activate

WORKDIR /workspace

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy backend package.json
COPY backend/package.json ./backend/

# Install all dependencies (workspace aware)
RUN pnpm install --frozen-lockfile

# Copy backend source code
COPY backend ./backend

WORKDIR /workspace/backend

# Expose port
EXPOSE 3000

# Default command (can be overridden in docker-compose)
CMD ["pnpm", "dev"]
