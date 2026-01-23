<p align="center">
  <a href="https://github.com/ElementsProject/cln-application">
    <img src="./.github/images/Dashboard.png" alt="Core Lightning Dashboard">
  </a>
  <h1 align="center">Core Lightning Application</h1>
  <h3 align="center">
    Run a Core Lightning application for your node. An official app by Blockstream. Powered by Core Lightning.
    <br />
    <br />
    <div align="center">
      <a href="https://twitter.com/Blockstream">
        <img src="https://img.shields.io/twitter/follow/blockstream?style=social" style="height: 21px;"/>
      </a>
      <a href="https://marketplace.start9.com">
        <img src="./.github/images/start9-badge-light.svg"/>
      </a>
      <a href="https://apps.umbrel.com/app/core-lightning">
        <img src="./.github/images/umbrel-badge-light.svg" style="width: 130px;height: 21px;"/>
      </a>
    </div>
  </h3>
</p>

---

# Prerequisites
* Functioning and synced Bitcoin & Core lightning node.
* Node.js, which can be downloaded [here](https://nodejs.org/en/download/)
* Recommended Browsers: Chrome, Firefox, MS Edge

---

# Getting started

- ## Standalone
  - ### Get latest release
      ```
      wget https://github.com/ElementsProject/cln-application/archive/refs/tags/v25.07.tar.gz
      tar -xzf v25.07.tar.gz
      ```

  - ### Dependency Installation and Compile

    ```
    cd cln-application-25.07
    npm ci
    npm run build
    npm prune --omit=dev
    ```

  - ### Environment Variables
      This application accepts & depends upon these variables to be passed through environment:

      ```
      # Required by entrypoint.sh script
      - LIGHTNING_DATA_DIR: Path for core lightning (used by entrypoint.sh, default: ``)
      - BITCOIN_NETWORK: Bitcoin network type (for entrypoint.sh; valid values: bitcoin/signet/testnet/regtest; default: `bitcoin`)

      # cln-application Values
      - APP_SINGLE_SIGN_ON: Flag to bypass application level authentication (valid values: true/false, default: false)
      - APP_PROTOCOL: Protocol on which the application will be served (valid values: http/https, default: `http`)
      - APP_HOST: Hostname/IP address of cln-application's container (default: `localhost`)
      - APP_PORT: Port on which this application should be served (default: `2103`)
      - APP_CONFIG_FILE: Path for cln-application's configuration file (default: `./config.json`)
      - APP_LOG_FILE: Path for cln-application's log file (default: `./application-cln.log`)
      - APP_MODE: Mode for logging and other settings (valid values: production/development/testing, default: `production`)
      - APP_CONNECT: Choose how to connect to CLN (valid values: COMMANDO/REST, default: `COMMANDO`)

      # Core lightning Values
      - LIGHTNING_HOST: IP address of Core lightning node (default: `localhost`)
      - LIGHTNING_TOR_HOST: Tor Hidden Service url (default: ``)
      - LIGHTNING_VARS_FILE: Full Path including the file name for connection auth with LIGHTNING_PUBKEY & LIGHTNING_RUNE (defult: `./.commando-env`)

      # CLN Commando (WS) Values
      - LIGHTNING_WS_PROTOCOL: Core lightning's web socket is serving on ws or serving via WSSProxy (valid values: ws/wss, default: `ws`)
      - LIGHTNING_WS_HOST: Core lightning's IP address where commando can connect (default: `localhost`)
      - LIGHTNING_WS_TOR_HOST: Core lightning's Tor address where commando can connect (default: ``)
      - LIGHTNING_WS_PORT: Core lightning's websocket port (used by `COMMANDO` APP_CONNECT; with `bind-addr=ws:`/`wss-bind-addr` in CLN config; default: `5001`)
      - LIGHTNING_WS_CLIENT_KEY_FILE: Client key file path including file name for websocket TLS authentication (used by `COMMANDO` APP_CONNECT and `wss` LIGHTNING_WS_PROTOCOL; default: `./client-key.pem`)
      - LIGHTNING_WS_CLIENT_CERT_FILE: Client certificate file path including file name for websocket TLS authentication (used by `COMMANDO` APP_CONNECT and `wss` LIGHTNING_WS_PROTOCOL; default: `./client.pem`)
      - LIGHTNING_WS_CA_CERT_FILE: CA certificate file path including file name for websocket TLS authentication (default: `./ca.pem`)

      # CLN REST Values
      - LIGHTNING_REST_PROTOCOL: Protocol on which REST is served (valid values: http/https, default: `https`)
      - LIGHTNING_REST_HOST: IP address/hostname of Core Lightning REST interface (used if APP_CONNECT is `REST`, default: `localhost`)
      - LIGHTNING_REST_TOR_HOST: Tor hidden service URL for Core Lightning REST interface (default: ``)
      - LIGHTNING_REST_PORT: REST server port (used if APP_CONNECT is `REST`; default: `3010`)
      - LIGHTNING_REST_CLIENT_KEY_FILE: Client key file path including file name for REST TLS authentication (default: `./client-key.pem`)
      - LIGHTNING_REST_CLIENT_CERT_FILE: Client certificate file path including file name for REST TLS authentication (default: `./client.pem`)
      - LIGHTNING_REST_CA_CERT_FILE: CA certificate file path including file name for REST TLS authentication (used by `REST` APP_CONNECT and `https` LIGHTNING_REST_PROTOCOL; default: `./ca.pem`)

      # CLN gRPC Values
      - LIGHTNING_GRPC_HOST: IP address/hostname of Core Lightning GRPC interface (default: `localhost`)
      - LIGHTNING_GRPC_TOR_HOST: Tor hidden service URL for Core Lightning GRPC interface (default: ``)
      - LIGHTNING_GRPC_PORT: Core lightning's GRPC port (default: `9736`)
      - LIGHTNING_GRPC_PROTO_PATH: URL to directory containing CLN gRPC protocol definitions (default: `https://github.com/ElementsProject/lightning/tree/master/cln-grpc/proto`)
      - LIGHTNING_GRPC_CLIENT_KEY_FILE: Client key file path including file name for GRPC TLS authentication (used by `GRPC` APP_CONNECT; default: `./client-key.pem`)
      - LIGHTNING_GRPC_CLIENT_CERT_FILE: Client certificate file path including file name for GRPC TLS authentication (used by `GRPC` APP_CONNECT; default: `./client.pem`)
      - LIGHTNING_GRPC_CA_CERT_FILE: CA certificate file path including file name for GRPC TLS authentication (used by `GRPC` APP_CONNECT; default: `./ca.pem`)
      ```

      Set these variables either via terminal OR by env.sh script OR by explicitly loading variables from .env files.
      Important Note: Environment variables take precedence over config.json variables. Like `APP_SINGLE_SIGN_ON` will take higher precedence over 
      `singleSignOn` from config.json.

  - ### Application Configuration
      This is the default `config.json` file which is required by application's frontend. If the file `APP_CONFIG_FILE` is missing at the location, one like below will be auto created:

      ```
        {
          "unit": "SATS",
          "fiatUnit": "USD",
          "appMode": "DARK",
          "isLoading": false,
          "error": null,
          "singleSignOn": false,
          "password": ""
        }
      ```

  - ### Commando Authentication
      - This application utilizes [lnmessage](https://github.com/aaronbarnardsound/lnmessage) and [commando](https://docs.corelightning.org/reference/lightning-commando) for connecting with core lightning node. The connection is trustless and end-to-end encrypted. Commando manages authentication and authorization through runes, which can grant either full or fine-grained permissions. 
      - The backend server reads `LIGHTNING_PUBKEY` & `LIGHTNING_RUNE` from the `LIGHTNING_VARS_FILE` file for this communication. 
      - Values can either be set manually or script `entrypoint.sh` can be used to call `getinfo` and `createrune` methods and save values in `LIGHTNING_VARS_FILE`.
      - `entrypoint.sh` can only run for the locally installed lightning. If `cln-application` is running remotely then pubkey and 
      rune can be set manually.
      - The script requires `socat` and `jq` to run successfully.
      - Sample commando config should look like:

        ```
          LIGHTNING_PUBKEY="03d2d3b2...0f8303bfe"
          LIGHTNING_RUNE="iv...4j"
        ```

  - ### Start The Application
      - Setup environment variables either via terminal OR by env.sh script OR by explicitly loading variables from .env files.
      - Run `start` script for starting your application's server at port `APP_PORT`

      ```
        npm run start
      ```
- ## Docker
  - For a minimal Docker setup to run the application with a remote Core Lightning node, see our [Docker Setup Guide](./.github/docs/Docker-Setup.md).

- ## Stores/Marketplaces
  - This application is also available on Umbrel App Store and Start9 OS with one click install.

---

# Contributing

- We welcome and appreciate new contributions!

- If you're a developer looking to help but not sure where to begin, look for [these issues](https://github.com/ElementsProject/cln-application/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) that have specifically been marked as being friendly to new contributors.

- If you're looking for a bigger challenge, before opening a pull request please [create an issue](https://github.com/ElementsProject/cln-application/issues/new/choose) to get feedback, discuss the best way to tackle the challenge, and to ensure that there's no duplication of work.

- Click [here](./.github/docs/Contributing.md) for instructions on how to run it in development mode.

---

# Acknowledgements

- This app is inspired by the work done by [Umbrel lightning app](https://github.com/getumbrel/umbrel-lightning).

- The backend api connects with core lightning via [lnmessage](https://github.com/aaronbarnardsound/lnmessage).
