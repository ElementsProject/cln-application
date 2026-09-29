# Build Stage
FROM node:26-bookworm@sha256:2aaae6d91f99fee84cfc92da9b52c22a185752d247746052bbc3f961e44478c6 AS cln-app-builder

# Install system dependencies (native modules pulled in by the test tooling)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3 \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

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
FROM node:26-bookworm-slim@sha256:662933cf47f013bc8e4beb31a6116448427a82057ba7c42c97e4c5ba766504c2 AS cln-app-final

# Install jq and socat for scripts/entrypoint.sh
RUN apt-get update && apt-get install -y --no-install-recommends jq socat \
    && rm -rf /var/lib/apt/lists/*

# Copy built code from build stages to '/app/frontend' directory
COPY --from=cln-app-builder /app/apps/frontend/build /app/apps/frontend/build
COPY --from=cln-app-builder /app/apps/frontend/public /app/apps/frontend/public
COPY --from=cln-app-builder /app/apps/frontend/package.json /app/apps/frontend/package.json

# Copy built code from build stages to '/app/backend' directory
COPY --from=cln-app-builder /app/apps/backend/dist /app/apps/backend/dist
COPY --from=cln-app-builder /app/apps/backend/proto /app/apps/backend/proto
COPY --from=cln-app-builder /app/apps/backend/package.json /app/apps/backend/package.json

# Copy built code from build stages to '/app' directory
COPY --from=cln-app-builder /app/package-lock.json /app/package-lock.json
COPY --from=cln-app-builder /app/package.json /app/package.json
COPY --from=cln-app-builder /app/node_modules /app/node_modules

# Change directory to '/app'
WORKDIR /app

COPY scripts/entrypoint.sh scripts/entrypoint.sh

# The process stays root on purpose: the entrypoint reads the node's RPC
# socket and writes the commando env file inside the mounted lightning data
# directory, which platform packages (Umbrel, StartOS) mount root-owned.
# Run with `--user` or compose `user:` when your mounts allow it.

ENTRYPOINT ["bash", "./scripts/entrypoint.sh"]
