#!/bin/sh
EXISTING_PUBKEY=""
GETINFO_RESPONSE=""
LIGHTNING_RPC=$CORE_LIGHTNING_PATH"/$APP_CORE_LIGHTNING_BITCOIN_NETWORK""/lightning-rpc"
COMMANDO_CONFIG="$COMMANDO_CONFIG"

echo "$LIGHTNING_RPC"

getinfo_request() {
  cat <<EOF
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getinfo",
  "params": []
}
EOF
}

commando_rune_request() {
  cat <<EOF
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "commando-rune",
  "params": [null, [["For Application#"]]]
}
EOF
}

commando_datastore_request() {
  cat <<EOF
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "datastore",
  "params": [["commando", "runes", "$UNIQUE_ID"], "$RUNE"]
}
EOF
}

generate_new_rune() {
  # Send 'commando-rune' request
  RUNE_RESPONSE=$( (echo "$(commando_rune_request)"; sleep 1) | socat - UNIX-CONNECT:"$LIGHTNING_RPC")
  RUNE=$(echo "$RUNE_RESPONSE" | jq -r '.result.rune')
  UNIQUE_ID=$(echo "$RUNE_RESPONSE" | jq -r '.result.unique_id')
  # Save rune in env file
  echo "LIGHTNING_RUNE=\"$RUNE\"" >> $COMMANDO_CONFIG
  echo "$RUNE"
  # This will fail for v>23.05
  DATASTORE_RESPONSE=$( (echo "$(commando_datastore_request)"; sleep 1) | socat - UNIX-CONNECT:"$LIGHTNING_RPC") > /dev/null
}

# Read existing pubkey
if [ -f "$COMMANDO_CONFIG" ]; then
  EXISTING_PUBKEY=$(head -n1 $COMMANDO_CONFIG)
fi

# Getinfo from CLN
until [ "$GETINFO_RESPONSE" != "" ]
do
  echo "Waiting for lightningd"
  # Send 'getinfo' request
  GETINFO_RESPONSE=$( (echo "$(getinfo_request)"; sleep 1) | socat - UNIX-CONNECT:"$LIGHTNING_RPC")
  echo "$GETINFO_RESPONSE"
done
# Write 'id' from the response as pubkey
LIGHTNING_PUBKEY="$(jq -n "$GETINFO_RESPONSE" | jq -r '.result.id')"
echo "$LIGHTNING_PUBKEY"

# Compare existing pubkey with current
if [ "$EXISTING_PUBKEY" != "LIGHTNING_PUBKEY=\"$LIGHTNING_PUBKEY\"" ]; then
  # Pubkey changed; rewrite new data on the file.
  echo "Pubkey mismatched; Rewriting the data."
  cat /dev/null > $COMMANDO_CONFIG
  echo "LIGHTNING_PUBKEY=\"$LIGHTNING_PUBKEY\"" >> $COMMANDO_CONFIG
  generate_new_rune
else
  echo "Pubkey matches with existing pubkey."
fi

exec "$@"
