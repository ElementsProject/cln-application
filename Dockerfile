# Build Stage
FROM node:20-bookworm AS cln-app-builder

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev

# Create app directory
WORKDIR /app

# Copy project files and folders
COPY apps/backend ./apps/backend
COPY apps/frontend ./apps/frontend
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm ci

# Build assets
RUN npm run build

# Prune development dependencies
RUN npm prune --omit=dev

# Final image
FROM node:20-bookworm-slim AS cln-app-final

# Install jq for JSON parsing in entrypoint.sh
RUN apt-get update && apt-get install -y jq socat

# Copy built code from build stages to '/app/frontend' directory
COPY --from=cln-app-builder /app/apps/frontend/build /app/apps/frontend/build
COPY --from=cln-app-builder /app/apps/frontend/public /app/apps/frontend/public
COPY --from=cln-app-builder /app/apps/frontend/package.json /app/apps/frontend/package.json

# Copy built code from build stages to '/app/backend' directory
COPY --from=cln-app-builder /app/apps/backend/dist /app/apps/backend/dist
COPY --from=cln-app-builder /app/apps/backend/package.json /app/apps/backend/package.json

# Copy built code from build stages to '/app' directory
COPY --from=cln-app-builder /app/package.json /app/package-lock.json
COPY --from=cln-app-builder /app/package.json /app/package.json
COPY --from=cln-app-builder /app/node_modules /app/node_modules

# Change directory to '/app' 
WORKDIR /app

COPY entrypoint.sh entrypoint.sh

ENTRYPOINT ["bash", "./entrypoint.sh"]
