# Build Stage
FROM node:18-buster AS umbrel-lightning-app-builder

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

# Final image
FROM node:18-buster-slim AS umbrel-lightning

# Copy built code from build stages to '/app' directory
COPY --from=umbrel-lightning-app-builder /app /app

# Change directory to '/app' 
WORKDIR /app

CMD [ "npm", "run", "start" ]
