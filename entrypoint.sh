#!/bin/bash
EXISTING_PUBKEY=""
GET_INFO=""

LIGHTNING_CLI_PATH="/root/.lightning/"
ENV_FILE_PATH="$LIGHTNING_CLI_PATH"".commando-env"
LIGHTNING_CLI_PATH="$LIGHTNING_CLI_PATH""lightning-cli"

function generate_new_rune() {
  NEW_RUNE_OBJ=$($LIGHTNING_CLI_PATH --network="$CLN_BITCOIN_NETWORK" commando-rune restrictions='[["For Umbrel#"]]')
  UNIQUE_ID=$(jq -n "$NEW_RUNE_OBJ" | jq ".unique_id")
  RUNE=$(jq -n "$NEW_RUNE_OBJ" | jq ".rune")
  echo "$RUNE"
  # Save rune in env file
  echo "CLN_RUNE=$RUNE" >> $ENV_FILE_PATH
  # This will fail for v>23.05
  $LIGHTNING_CLI_PATH --network="$CLN_BITCOIN_NETWORK" datastore '["commando", "runes", '"$UNIQUE_ID"']' "$RUNE" > /dev/null
}

# Read existing pubkey
if [ -f "$ENV_FILE_PATH" ]; then
  EXISTING_PUBKEY=$(head -n1 $ENV_FILE_PATH)
fi

# Getinfo from CLN
until [[ "$GET_INFO" != "" ]]
do
  echo "Waiting for lightningd"
  sleep 0.5
  GET_INFO=$($LIGHTNING_CLI_PATH --network="$CLN_BITCOIN_NETWORK" getinfo)
done
CLN_PUBKEY="$(jq -n "$GET_INFO" | jq ".id")"

# Compare existing pubkey with current
if [[ "$EXISTING_PUBKEY" != "CLN_PUBKEY=$CLN_PUBKEY" ]]; then
  # Pubkey changed; rewrite new data on the file.
  echo "Pubkey mismatched; Rewriting the data."
  cat /dev/null > $ENV_FILE_PATH
  echo CLN_PUBKEY="$CLN_PUBKEY" >> $ENV_FILE_PATH
  generate_new_rune
else
  echo "Pubkey matches with existing pubkey."
fi

exec "$@"
