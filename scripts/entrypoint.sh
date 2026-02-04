#!/bin/sh
EXISTING_PUBKEY=""
GETINFO_RESPONSE=""
LIGHTNING_RPC=$LIGHTNING_DATA_DIR"/$BITCOIN_NETWORK""/lightning-rpc"

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

createrune_request() {
  cat <<EOF
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "createrune",
  "params": [null, [["For Application#"]]]
}
EOF
}

commando_datastore_request() {
  cat <<EOF
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "datastore",
  "params": [["commando", "runes", "$UNIQUE_ID"], "$RUNE"]
}
EOF
}

generate_new_rune() {
  COUNTER=0
  RUNE=""
  while { [ "$RUNE" = "" ] || [ "$RUNE" = "null" ]; } && [ $COUNTER -lt 10 ]; do
    # Send 'createrune' request
    echo "Generating rune attempt: $COUNTER"
    COUNTER=$((COUNTER+1))

    RUNE_RESPONSE=$( (echo "$(createrune_request)"; sleep 2) | socat - UNIX-CONNECT:"$LIGHTNING_RPC")

    RUNE=$(echo "$RUNE_RESPONSE" | jq -r '.result.rune')
    UNIQUE_ID=$(echo "$RUNE_RESPONSE" | jq -r '.result.unique_id')
    echo "RUNE_RESPONSE"
    echo "$RUNE_RESPONSE"
    echo "RUNE"
    echo "$RUNE"

    if [ "$RUNE" != "" ] && [ "$RUNE" != "null" ]; then
      # Save rune in env file
      echo "LIGHTNING_RUNE=\"$RUNE\"" >> "$LIGHTNING_VARS_FILE"
    fi

    if [ "$UNIQUE_ID" != "" ] &&  [ "$UNIQUE_ID" != "null" ]; then
      # This will fail for v>23.05
      DATASTORE_RESPONSE=$( (echo "$(commando_datastore_request)"; sleep 1) | socat - UNIX-CONNECT:"$LIGHTNING_RPC") > /dev/null
    fi
  done
  if [ $COUNTER -eq 10 ] && [ "$RUNE" = "" ]; then
    echo "Error: Unable to generate rune for application authentication!"
  fi
}

# Read existing pubkey
if [ -f "$LIGHTNING_VARS_FILE" ]; then
  EXISTING_PUBKEY=$(head -n1 "$LIGHTNING_VARS_FILE")
  EXISTING_RUNE=$(sed -n "2p" "$LIGHTNING_VARS_FILE")
  echo "EXISTING_PUBKEY"
  echo "$EXISTING_PUBKEY"
  echo "EXISTING_RUNE"
  echo "$EXISTING_RUNE"
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
if [ "$EXISTING_PUBKEY" != "LIGHTNING_PUBKEY=\"$LIGHTNING_PUBKEY\"" ] ||
  [ "$EXISTING_RUNE" = "" ] || 
  [ "$EXISTING_RUNE" = "LIGHTNING_RUNE=\"\"" ] ||
  [ "$EXISTING_RUNE" = "LIGHTNING_RUNE=\"null\"" ]; then
  # Pubkey changed or missing rune; rewrite new data on the file.
  echo "Pubkey mismatched or missing rune; Rewriting the data."
  cat /dev/null > "$LIGHTNING_VARS_FILE"
  echo "LIGHTNING_PUBKEY=\"$LIGHTNING_PUBKEY\"" >> "$LIGHTNING_VARS_FILE"
  generate_new_rune
else
  echo "Pubkey matches with existing pubkey."
fi

exec "$@"
