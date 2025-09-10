## Docker Setup Guide

### Application Configuration

Create a configuration file that will be mounted into the container. This persists your settings between runs.

**File:** `config.json`
```bash
mkdir -p /tmp/docker/ && cat > /tmp/docker/config.json << 'EOF'
{
  "unit": "SATS",
  "fiatUnit": "USD",
  "appMode": "DARK",
  "singleSignOn": false,
  "password": ""
}
EOF
```

### Replace the Entrypoint Script

The default entrypoint expects a local `lightning-rpc` socket. It can be replaced with simpler version below if we can not provide access to `lightning-rpc`.

**File:** `entrypoint.sh`
```bash
cat > /tmp/docker/entrypoint.sh << 'EOF'
#!/bin/sh
echo "Replaced default entrypoint"
exec "$@"
EOF

chmod +x /tmp/docker/entrypoint.sh
```

### Core Lightning Authentication (Commando)

Create a file to store the credentials for authenticating with remote Core Lightning node.

**File:** `.commando`
```bash
cat > /tmp/docker/.commando << 'EOF'
LIGHTNING_PUBKEY="<YOUR_NODE_PUBKEY>"
LIGHTNING_RUNE="<YOUR_RUNE>"
EOF
```

### 4. Run the Docker Container

The following command starts the `cln-application` container, configured to connect to remote core lightning node "cln-node" via its exposed WebSocket port 5018.

```bash
docker run -d \
  --name cln-app \
  --network application-net \
  -v '/tmp/docker/config.json:/app/config.json' \
  -v '/tmp/docker/.commando:/app/.commando' \
  -v '/tmp/docker/entrypoint.sh:/app/entrypoint.sh' \
  -p 2103:2103 \
  -e APP_SINGLE_SIGN_ON=false \
  -e BITCOIN_NETWORK="regtest" \
  -e APP_CONFIG_FILE="/app/config.json" \
  -e APP_CONNECT="COMMANDO" \
  -e APP_PROTOCOL="http" \
  -e APP_HOST="0.0.0.0" \
  -e APP_PORT=2103 \
  -e LIGHTNING_HOST="cln-node" \
  -e LIGHTNING_VARS_FILE="/app/.commando" \
  -e LIGHTNING_WS_PROTOCOL="ws" \
  -e LIGHTNING_WS_PORT=5018 \
  ghcr.io/elementsproject/cln-application:25.07.2 npm run start
```

### Access the Application

Once the container is running, open your web browser and navigate to: **http://localhost:2103**
