FROM node:22-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.12.1 --activate

WORKDIR /workspace

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy frontend package.json
COPY frontend/package.json ./frontend/

# Install all dependencies (workspace aware)
RUN pnpm install --frozen-lockfile

# Copy frontend source code
COPY frontend ./frontend

WORKDIR /workspace/frontend

# Expose port
EXPOSE 5173

# Default command (can be overridden in docker-compose)
CMD ["pnpm", "dev", "--host"]
