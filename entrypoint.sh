#!/bin/bash
ENV_FILE_PATH="/root/.lightning/.commando-env"

# Clear old data on container restart
if [ -f "$ENV_FILE_PATH" ]; then
  rm -f $ENV_FILE_PATH
fi

# Getinfo from CLN and save pubkey in env file
GET_INFO=$(/root/.lightning/lightning-cli --network=$APP_BITCOIN_NETWORK getinfo)
echo APP_CORE_LIGHTNING_NODE_PUBKEY=$(jq -n "$GET_INFO" | jq ".id") >> $ENV_FILE_PATH

# Search for umbrel rune in datastore & save if found([list_datastore])
function filter_umbrel_rune_from_datastore() {
  LIST_DATASTORE=$1
  echo $LIST_DATASTORE | jq -r '.datastore[].string' | while read RUNE_STR; do
    DECODED_RUNE=$(/root/.lightning/lightning-cli --network=regtest decode "string"="$RUNE_STR")
    SEARCH_STR="For Umbrel#"
    if [[ $(jq -n "$DECODED_RUNE" | jq ".string") == *"$SEARCH_STR"* && $(jq -n "$DECODED_RUNE" | jq ".valid") == true ]]; then
      echo APP_CORE_LIGHTNING_RUNE=$RUNE >> $ENV_FILE_PATH
      return 1
    fi
  done
}

# Search for umbrel rune from listrunes & save if found([list_runes])
function filter_umbrel_rune_from_listrunes() {
  LIST_RUNES=$1
  echo $LIST_RUNES | jq -c '.runes[]' | while read RUNE_OBJ; do
    SEARCH_STR="comment: For Umbrel"
    if [[ $(jq -n "$RUNE_OBJ" | jq ".english") == *"$SEARCH_STR"* && $(jq -n "$RUNE_OBJ" | jq ".blacklisted") != true ]]; then
      echo APP_CORE_LIGHTNING_RUNE=$(jq -n "$RUNE_OBJ" | jq ".rune") >> $ENV_FILE_PATH
      return 1
    fi
  done
}

# Generate new rune ([save_in_datastore])
function generate_new_rune() {
  NEW_RUNE_OBJ=$(/root/.lightning/lightning-cli --network=$APP_BITCOIN_NETWORK commando-rune restrictions='[["For Umbrel#"]]')
  UNIQUE_ID=$(jq -n "$NEW_RUNE_OBJ" | jq ".unique_id")
  RUNE=$(jq -n "$NEW_RUNE_OBJ" | jq ".rune")

  # Save rune in env file
  echo APP_CORE_LIGHTNING_RUNE=$RUNE >> $ENV_FILE_PATH

  # Save rune in the datastore for future use (for v<23.05)
  if [[ "$1" == "true" ]]; then
    $(/root/.lightning/lightning-cli --network=$APP_BITCOIN_NETWORK datastore '["commando", "runes", '$UNIQUE_ID']' $RUNE)
  fi
}

# Check if rune already exists in listrunes (for v>23.05)
LIST_RUNES=$(/root/.lightning/lightning-cli --network=$APP_BITCOIN_NETWORK commando-listrunes)

if [[ "$(jq -n "$LIST_RUNES" | jq '.runes | length')" > "0" ]]; then
  filter_umbrel_rune_from_listrunes "$LIST_RUNES"
  RUNE_FOUND=$?
  if [[ "$RUNE_FOUND" != "1" ]]; then
    # Rune not found in listrunes; Generating new rune
    generate_new_rune "false"
  # else
    # Rune found in liststore; Saved in env
  fi
else
  # Search rune in the datastore (for v<23.05)
  LIST_DATASTORE=$(/root/.lightning/lightning-cli --network=$APP_BITCOIN_NETWORK listdatastore '["commando", "runes"]')
  if [[ "$(jq -n "$LIST_DATASTORE" | jq '.datastore | length')" > "0" ]]; then
    filter_umbrel_rune_from_datastore "$LIST_DATASTORE"
    RUNE_FOUND=$?
    if [[ "$RUNE_FOUND" != "1" ]]; then
      # Rune not found in datastore; Generating & saving new rune
      generate_new_rune "true"
    # else
      # Rune found in datastore; Saved in env
    fi
  else
    # Datastore empty; Generating & saving new rune
    generate_new_rune "true"
  fi
fi

exec "$@"