<p align="center">
  <a href="https://github.com/ElementsProject/cln-application">
    <img src="./.github/images/Dashboard.png" alt="Core Lightning Dashboard">
  </a>
  <h1 align="center">Core Lightning Application</h1>
  <h3 align="center">
    Run a Core Lightning application for your node. An official app by Blockstream. Powered by Core Lightning.
    <br />
    <br />
    <a href="https://twitter.com/Blockstream">
      <img src="https://img.shields.io/twitter/follow/blockstream?style=social" />
    </a>
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
        wget https://github.com/ElementsProject/cln-application/archive/refs/tags/v0.0.1.tar.gz
        tar -xzf v0.0.1.tar.gz
      ```

  - ### Dependency Installation
      ```
          cd cln-application-0.0.1
          npm install --omit=dev
      ```

  - ### Environment Variables
      This application accepts & depeneds upon these variables to be passed through environment:

      ```
        - APP_CORE_LIGHTNING_IP: IP address of the core lightning container (required)
        - APP_CORE_LIGHTNING_PORT: Port on which this application should be served (required)
        - APP_CORE_LIGHTNING_DAEMON_IP: Core lightning deamon bind address (cln config bind-addr; required)
        - APP_CORE_LIGHTNING_WEBSOCKET_PORT: Core lightning's websocket port (cln config experimental-websocket-port; required)
        - APP_CONFIG_DIR: Path for application's configuration file (config.json; required)
        - COMMANDO_CONFIG: Full Path including file name for commando auth with PUBKEY & RUNE (required)
        - APP_CORE_LIGHTNING_REST_PORT: c-lightning-REST server port (optional; for connect wallet screen)
        - APP_CORE_LIGHTNING_REST_CERT_DIR: Path for c-lightning-REST certificates (optional; for connect wallet screen)
        - APP_CORE_LIGHTNING_BITCOIN_NETWORK: Bitcoin network type (optional; required for entrypoint.sh; valid values: bitcoin/signet/testnet/regtest)
        - APP_CORE_LIGHTNING_DAEMON_GRPC_PORT: Core lightning's GRPC port (optional; future proofing for connect wallet screen)
        - APP_CORE_LIGHTNING_REST_HIDDEN_SERVICE: REST hidden service url (optional; for connect wallet screen)
        - LOCAL_HOST: Docker setup variable (optional; for connect wallet screen)
        - APP_MODE: Mode for logging and other settings (optional; valid values: production/development/testing)
        - CORE_LIGHTNING_PATH: Path for core lightning (optional; required for entrypoint.sh)
      ```

      Set these variables either via terminal OR by env.sh script OR by explicity loading varibles from .env files.

  - ### Application Configuration
      This is the config.json file which is required by application's frontend. If the file named `config.json` is missing at `APP_CONFIG_DIR` location, one like below will be auto created:

      ```
        {
          "unit": "SATS",
          "fiatUnit": "USD",
          "appMode": "DARK",
          "isLoading": false,
          "error": null
        }
      ```

  - ### Commando Authentication
      - This application utilizes [lnmessage](https://github.com/aaronbarnardsound/lnmessage) and [commando](https://docs.corelightning.org/reference/lightning-commando) for connecting with core lightning node. The connection is trustless and end-to-end encrypted. Commando manages authentication and authorization through runes, which can grant either full or fine-grained permissions. 
      - The backend server reads `LIGHTNING_PUBKEY` & `LIGHTNING_RUNE` from the `COMMANDO_CONFIG` file for this communication. 
      - Values can either be set manually or script `entrypoint.sh` can be used to call `getinfo` and `commando-rune` methods and save values in `COMMANDO_CONFIG`.
      - Sample commando config should look like:

        ```
          LIGHTNING_PUBKEY="03d2d3b2...0f8303bfe"
          LIGHTNING_RUNE="iv...4j"
        ```

  - ### Start The Application
      Run `start` script for starting your application's server at port `APP_CORE_LIGHTNING_PORT`

      ```
        npm run start
      ```

- ## Umbrel Store
  - This application is also available on Umbrel App Store with one click install.

---

# Contributing

- We welcome and appreciate new contributions!

- If you're a developer looking to help but not sure where to begin, look for [these issues](https://github.com/ElementsProject/cln-application/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) that have specifically been marked as being friendly to new contributors.

- If you're looking for a bigger challenge, before opening a pull request please [create an issue](https://github.com/ElementsProject/cln-application/issues/new/choose) to get feedback, discuss the best way to tackle the challenge, and to ensure that there's no duplication of work.

- Click [here](./docs/Contributing.md) for instructions on how to run it in development mode.

---

# Acknowledgements

- This app is inpired by the work done by [Umbrel lightning app](https://github.com/getumbrel/umbrel-lightning).

- The backend api connects with core lightning via [lnmessage](https://github.com/aaronbarnardsound/lnmessage).
