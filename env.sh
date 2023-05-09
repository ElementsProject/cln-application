#!/bin/bash
SETUP=${1:-local}

export APP_BITCOIN_NETWORK="regtest"
export APP_CORE_LIGHTNING_BITCOIN_NETWORK="$APP_BITCOIN_NETWORK"
if [ "$APP_BITCOIN_NETWORK" == "mainnet" ]; then
	export APP_CORE_LIGHTNING_BITCOIN_NETWORK="bitcoin"
fi

export APP_CORE_LIGHTNING_PORT=2103
export APP_CORE_LIGHTNING_REST_HIDDEN_SERVICE="notyetset.onion"
export APP_MODE="testing"

if [ "$SETUP" == "docker" ]; then
    export DEVICE_DOMAIN_NAME="docker.local"
    export LOCAL_HOST="http://""$DEVICE_DOMAIN_NAME"
    export APP_BITCOIN_NODE_IP="170.21.21.2"
    export APP_CORE_LIGHTNING_DAEMON_IP="170.21.21.3"
    export LIGHTNING_REST_IP="170.21.21.4"
    export APP_CORE_LIGHTNING_IP="170.21.21.5"
    export APP_CONFIG_DIR="/data/app"
    export APP_CORE_LIGHTNING_REST_CERT_DIR="/c-lightning-rest/certs"
    export APP_CORE_LIGHTNING_WEBSOCKET_PORT=2106
    export APP_BITCOIN_RPC_USER="umbrel"
    export APP_BITCOIN_RPC_PASS="moneyprintergobrrr"
    export APP_CORE_LIGHTNING_DAEMON_GRPC_PORT=2105
    export APP_CORE_LIGHTNING_REST_PORT=2104
    export CORE_LIGHTNING_PATH="/root/.lightning"
    export COMMANDO_CONFIG="/root/.lightning/.commando-env"
    echo "Docker Environment Variables Set"
else
    export DEVICE_DOMAIN_NAME="local.local"
    export LOCAL_HOST="http://""$DEVICE_DOMAIN_NAME"
    export APP_BITCOIN_NODE_IP="localhost"
    export APP_CORE_LIGHTNING_DAEMON_IP="localhost"
    export LIGHTNING_REST_IP="localhost"
    export APP_CORE_LIGHTNING_IP="localhost"
    export APP_CONFIG_DIR="$PWD/data/app"
    export APP_CORE_LIGHTNING_REST_CERT_DIR="$PWD/data/c-lightning-rest/certs"
    export APP_CORE_LIGHTNING_WEBSOCKET_PORT=5010
    export APP_CORE_LIGHTNING_DAEMON_GRPC_PORT=5011
    export APP_CORE_LIGHTNING_REST_PORT=3001
    export CORE_LIGHTNING_PATH="/home/shahana/workspace/.lightning/l1-regtest"
    export COMMANDO_CONFIG="$PWD/.commando"
    echo "Local Environment Variables Set"
fi
