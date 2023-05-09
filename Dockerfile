# Build Stage
FROM node:18-buster AS cln-app-builder

# Create app directory
WORKDIR /app

# Copy project files and folders
COPY apps/backend ./apps/backend
COPY apps/frontend ./apps/frontend
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Build assets
RUN npm run build

# Prune development dependencies
RUN npm prune --omit=dev

# Final image
FROM node:18-buster-slim AS cln-app-final

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
COPY --from=cln-app-builder /app/package.json /app/package.json
COPY --from=cln-app-builder /app/node_modules /app/node_modules

# Change directory to '/app' 
WORKDIR /app

COPY entrypoint.sh entrypoint.sh

ENTRYPOINT ["bash", "./entrypoint.sh"]
