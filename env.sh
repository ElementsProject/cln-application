SETUP=${1:-local}

export GENERATE_SOURCEMAP=false
export APP_BITCOIN_NETWORK="regtest"
export BITCOIN_NETWORK="$APP_BITCOIN_NETWORK"
if [[ "$APP_BITCOIN_NETWORK" == "mainnet" ]]; then
	export BITCOIN_NETWORK="bitcoin"
fi

export APP_PORT=2103
export LIGHTNING_TOR_HOST="http://oqaer4kd7ufryngx6dsztovs4pnlmaouwmtkofjsd2m7pkq7qd.onion"
export APP_MODE="testing"
export APP_PROTOCOL="http"

if [[ "$SETUP" == "docker" ]]; then
    export LIGHTNING_HOST="docker.local"
    export BITCOIN_HOST="170.21.22.2"
    export LIGHTNING_IP="170.21.22.3"
    export APP_HOST="170.21.22.5"
    export LIGHTNING_WS_PORT=2106
    export APP_BITCOIN_RPC_USER="user"
    export APP_BITCOIN_RPC_PASS="password"
    export LIGHTNING_GRPC_PORT=2105
    export LIGHTNING_REST_PORT=2104
    export APP_SINGLE_SIGN_ON=true
    export LIGHTNING_GRPC_PROTO_PATH="https://github.com/ElementsProject/lightning/tree/master/cln-grpc/proto"
    export LIGHTNING_DATA_DIR="/data/.lightning"
    export LIGHTNING_VARS_FILE="/data/.lightning/.commando-env"
    echo "Docker Environment Variables Set"
else
    export LIGHTNING_HOST="local.local"
    export BITCOIN_HOST="localhost"
    export LIGHTNING_IP="localhost"
    export APP_HOST="127.0.0.1"
    export LIGHTNING_WS_PORT=5001
    export LIGHTNING_GRPC_PORT=5002
    export LIGHTNING_REST_PORT=3001
    export APP_SINGLE_SIGN_ON=false
    export LIGHTNING_GRPC_PROTO_PATH="https://github.com/ElementsProject/lightning/tree/master/cln-grpc/proto"
    export LIGHTNING_DATA_DIR="/home/.lightning/l1-regtest"
    export LIGHTNING_VARS_FILE="$PWD/.commando"
    echo "Local Environment Variables Set"
fi
