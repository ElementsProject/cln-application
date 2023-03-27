#!/bin/bash
EXISTING_PUBKEY=""
GET_INFO=""

LIGHTNINGD_PATH="/lightningd/"
ENV_FILE_PATH="$LIGHTNINGD_PATH"".commando-env"
LIGHTNING_CLI_PATH="$LIGHTNINGD_PATH""lightning-cli"

echo $LIGHTNING_CLI_PATH

function generate_new_rune() {
  NEW_RUNE_OBJ=$($LIGHTNING_CLI_PATH --network="$APP_CORE_LIGHTNING_NETWORK" --lightning-dir="$APP_CORE_LIGHTNING_COMMANDO_ENV_DIR" commando-rune restrictions='[["For Umbrel#"]]')
  UNIQUE_ID=$(jq -n "$NEW_RUNE_OBJ" | jq ".unique_id")
  RUNE=$(jq -n "$NEW_RUNE_OBJ" | jq ".rune")
  echo "$RUNE"
  # Save rune in env file
  echo "LIGHTNING_RUNE=$RUNE" >> $ENV_FILE_PATH
  # This will fail for v>23.05
  $LIGHTNING_CLI_PATH --network="$APP_CORE_LIGHTNING_NETWORK" --lightning-dir="$APP_CORE_LIGHTNING_COMMANDO_ENV_DIR" datastore '["commando", "runes", '"$UNIQUE_ID"']' "$RUNE" > /dev/null
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
  GET_INFO=$($LIGHTNING_CLI_PATH --network="$APP_CORE_LIGHTNING_NETWORK" --lightning-dir="$APP_CORE_LIGHTNING_COMMANDO_ENV_DIR" getinfo)
done
LIGHTNING_PUBKEY="$(jq -n "$GET_INFO" | jq ".id")"

# Compare existing pubkey with current
if [[ "$EXISTING_PUBKEY" != "LIGHTNING_PUBKEY=$LIGHTNING_PUBKEY" ]]; then
  # Pubkey changed; rewrite new data on the file.
  echo "Pubkey mismatched; Rewriting the data."
  cat /dev/null > $ENV_FILE_PATH
  echo LIGHTNING_PUBKEY="$LIGHTNING_PUBKEY" >> $ENV_FILE_PATH
  generate_new_rune
else
  echo "Pubkey matches with existing pubkey."
fi

exec "$@"
