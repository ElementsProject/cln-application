#!/bin/sh
EXISTING_PUBKEY=""
GETINFO_RESPONSE=""
LIGHTNING_RPC=$CORE_LIGHTNING_PATH"/$APP_CORE_LIGHTNING_BITCOIN_NETWORK""/lightning-rpc"

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
  "id": 2,
  "method": "commando-rune",
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
    # Send 'commando-rune' request
    echo "Generating rune attempt: $COUNTER"
    COUNTER=$((COUNTER+1))

    RUNE_RESPONSE=$( (echo "$(commando_rune_request)"; sleep 2) | socat - UNIX-CONNECT:"$LIGHTNING_RPC")

    RUNE=$(echo "$RUNE_RESPONSE" | jq -r '.result.rune')
    UNIQUE_ID=$(echo "$RUNE_RESPONSE" | jq -r '.result.unique_id')
    echo "RUNE_RESPONSE"
    echo "$RUNE_RESPONSE"
    echo "RUNE"
    echo "$RUNE"

    if [ "$RUNE" != "" ] && [ "$RUNE" != "null" ]; then
      # Save rune in env file
      echo "LIGHTNING_RUNE=\"$RUNE\"" >> "$COMMANDO_CONFIG"
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
if [ -f "$COMMANDO_CONFIG" ]; then
  EXISTING_PUBKEY=$(head -n1 "$COMMANDO_CONFIG")
  EXISTING_RUNE=$(sed -n "2p" "$COMMANDO_CONFIG")
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

# Check if the existing rune is blacklisted
is_blacklisted=false
if [ "$EXISTING_RUNE" != "" ] && [ "$EXISTING_RUNE" != "LIGHTNING_RUNE=\"\"" ] && [ "$EXISTING_RUNE" != "LIGHTNING_RUNE=\"null\"" ]; then
  EXISTING_RUNE_VALUE=$(echo "$EXISTING_RUNE" | sed 's/LIGHTNING_RUNE="//' | sed 's/"//')
  echo "Checking if rune is blacklisted: $EXISTING_RUNE_VALUE"

  RUNES_RESPONSE=$(lightning-cli showrunes)
  echo "RUNES_RESPONSE: $RUNES_RESPONSE"

  is_blacklisted=$(echo "$RUNES_RESPONSE" | jq -r ".runes[] | select(.rune == \"$EXISTING_RUNE_VALUE\") | .blacklisted")
  is_blacklisted=${is_blacklisted:-false}

  echo "Is Blacklisted: $is_blacklisted"
fi

# Compare existing pubkey with current and check if rune is blacklisted
if [ "$EXISTING_PUBKEY" != "LIGHTNING_PUBKEY=\"$LIGHTNING_PUBKEY\"" ] ||
  [ "$EXISTING_RUNE" = "" ] || 
  [ "$EXISTING_RUNE" = "LIGHTNING_RUNE=\"\"" ] ||
  [ "$EXISTING_RUNE" = "LIGHTNING_RUNE=\"null\"" ] ||
  [ "$is_blacklisted" = "true" ]; then
  # Pubkey mismatched, rune missing, or blacklisted; rewrite new data on the file.
  echo "Pubkey mismatched, missing rune, or blacklisted rune; Rewriting the data."
  cat /dev/null > "$COMMANDO_CONFIG"
  echo "LIGHTNING_PUBKEY=\"$LIGHTNING_PUBKEY\"" >> "$COMMANDO_CONFIG"
  generate_new_rune
else
  echo "Pubkey matches with existing pubkey and rune is valid."
fi

exec "$@"
