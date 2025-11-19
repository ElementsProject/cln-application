#!/bin/bash

export GENERATE_SOURCEMAP=false
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
nvm use 20.14.0

export APP_SINGLE_SIGN_ON=false
export BITCOIN_NETWORK="regtest"
export APP_CONFIG_FILE="$PWD/data/app/config.json"
export APP_LOG_FILE="$PWD/data/app/application-cln.log"
export APP_MODE="testing"
export APP_CONNECT="COMMANDO"
export APP_PROTOCOL="http"
export APP_HOST="localhost"
export APP_PORT=2103
export LIGHTNING_DATA_DIR="/home/.lightning"
export LIGHTNING_HOST="user.local"
export LIGHTNING_TOR_HOST="tor.onion"
export LIGHTNING_VARS_FILE="$PWD/.commando"
export LIGHTNING_WS_PROTOCOL="wss"
export LIGHTNING_WS_HOST="user.local"
export LIGHTNING_WS_TOR_HOST="tor.onion"
export LIGHTNING_WS_PORT=5001
export LIGHTNING_WS_CLIENT_KEY_FILE="/home/.lightning/regtest/client-key.pem"
export LIGHTNING_WS_CLIENT_CERT_FILE="/home/.lightning/regtest/client.pem"
export LIGHTNING_WS_CA_CERT_FILE="/home/.lightning/regtest/ca.pem"
export LIGHTNING_REST_HOST="localhost"
export LIGHTNING_REST_TOR_HOST="tor.onion"
export LIGHTNING_REST_PORT=3010
export LIGHTNING_REST_CLIENT_KEY_FILE="/home/.lightning/regtest/client-key.pem"
export LIGHTNING_REST_CLIENT_CERT_FILE="/home/.lightning/regtest/client.pem"
export LIGHTNING_REST_CA_CERT_FILE="/home/.lightning/regtest/ca.pem"
export LIGHTNING_GRPC_HOST="localhost"
export LIGHTNING_GRPC_TOR_HOST="tor.onion"
export LIGHTNING_GRPC_PORT=9736
export LIGHTNING_GRPC_PROTO_PATH="https://github.com/ElementsProject/lightning/tree/master/cln-grpc/proto"
export LIGHTNING_GRPC_CLIENT_KEY_FILE="/home/.lightning/regtest/client-key.pem"
export LIGHTNING_GRPC_CLIENT_CERT_FILE="/home/.lightning/regtest/client.pem"
export LIGHTNING_GRPC_CA_CERT_FILE="/home/.lightning/regtest/ca.pem"
echo "Local Environment Variables Set"
