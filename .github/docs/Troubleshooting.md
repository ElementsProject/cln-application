Debugging Commando Connection
-----------------------------

#### Configure the environment (if not already done):

```sh
cp env.sh env-local.sh
# Edit env-local.sh with your local configuration
source env-local.sh
```

#### Set up Commando authentication (if not already done):

- You can configure Commando credentials in one of the following ways:
  - Manual setup: Update LIGHTNING_PUBKEY and LIGHTNING_RUNE in your LIGHTNING_VARS_FILE.
  - Automated setup: Run the setup script (requires socat and jq): `source ./scripts/entrypoint.sh`

#### Verify the Commando connection:

After all environment variables are set, run the following script to verify that Commando environment variables are configured and loaded correctly

```sh
node ./scripts/check-commando-connection.js
```
