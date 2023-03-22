#!/bin/bash
# Bitcoin Variables
export APP_ID="core-lightning"
export DEVICE_DOMAIN_NAME="local.local"
export BITCOIN_NETWORK="regtest"
export BITCOIN_NODE_IP="127.0.0.1"

# Lightning Variables
export CLN_BITCOIN_NETWORK="${BITCOIN_NETWORK}"
export BITCOIN_RPC_USER="umbrel"
export BITCOIN_RPC_PASS="moneyprintergobrrr"
export CLN_DAEMON_GRPC_PORT=2105
export CLN_DAEMON_IP="localhost"
export CLN_DAEMON_WS_PORT=5001
# BOX
# export CLN_DAEMON_IP="192.168.1.89"
# export CLN_DAEMON_WS_PORT=5050

# C-lightning-REST Variables
export CLN_REST_IP="127.0.0.1"
export CLN_REST_PORT=2104
export CLN_REST_CERT_DIR="./data/c-lightning-rest/certs"
export CLN_REST_HIDDEN_SERVICE="notyetset.onion"

# C-lightning-REST TOR Variables
export CLN_TOR_HOST=""
export TOR_DATA_DIR="."
export TOR_PROXY_IP=""
export TOR_PROXY_PORT=""
export TOR_PASSWORD=""

# Application Variables
export APP_IP="localhost"
export APP_PORT="2103"
export APP_DATA_DIR="../../../../"
export APPLICATION_MODE="development"
echo "Local Environment Variables Set"
