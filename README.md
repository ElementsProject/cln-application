<p align="center">
  <h1 align="center">SuperScalar Wallet</h1>
  <p align="center">
    A non-custodial Lightning wallet powered by <a href="https://superscalar.win">SuperScalar</a> channel factories.
  </p>
</p>

---

## Overview

SuperScalar Wallet is a web-based interface for managing Lightning channel factories on [Core Lightning](https://github.com/ElementsProject/lightning). It connects to the [SuperScalar CLN plugin](https://github.com/8144225309/superscalar-cln) to provide factory lifecycle management, channel visualization, and standard Lightning node operations.

SuperScalar enables multiple users to share a single on-chain UTXO for non-custodial Lightning channel access — no consensus changes required. For a detailed explanation of the protocol, visit [superscalar.win](https://superscalar.win).

## Features

- Factory creation, rotation, and cooperative close
- Factory channel mapping and balance visualization
- Per-epoch breach and revocation monitoring
- Factory expiry tracking with laddering overview
- Full Lightning node management (channels, payments, invoices, bookkeeping)
- SQL query terminal for advanced node introspection

## Prerequisites

- Synced Bitcoin and Core Lightning node
- [SuperScalar CLN plugin](https://github.com/8144225309/superscalar-cln) installed and active
- [Node.js](https://nodejs.org/en/download/)
- Recommended browsers: Chrome, Firefox, MS Edge

## Getting Started

### Standalone

```bash
git clone https://github.com/8144225309/superscalar-wallet.git
cd superscalar-wallet
npm ci
npm run build
npm prune --omit=dev
npm run start
```

### Docker

For Docker deployment with a remote Core Lightning node, see the [Docker Setup Guide](./.github/docs/Docker-Setup.md).

### Configuration

The application connects to Core Lightning via [Commando](https://docs.corelightning.org/reference/lightning-commando) (default) or REST. See [Environment Variables](#environment-variables) for connection options.

Authentication uses [runes](https://docs.corelightning.org/reference/lightning-commando) for trustless, end-to-end encrypted communication. The `entrypoint.sh` script can auto-generate credentials for local installations, or they can be configured manually for remote nodes.

## Environment Variables

<details>
<summary>Click to expand</summary>

```
# Required by entrypoint.sh
LIGHTNING_DATA_DIR     # Path for Core Lightning data
BITCOIN_NETWORK        # bitcoin / signet / testnet / regtest (default: bitcoin)

# Application
APP_SINGLE_SIGN_ON     # Bypass app-level auth (default: false)
APP_PROTOCOL           # http / https (default: http)
APP_HOST               # Hostname (default: localhost)
APP_PORT               # Port (default: 2103)
APP_CONFIG_FILE        # Config file path (default: ./config.json)
APP_LOG_FILE           # Log file path (default: ./application-cln.log)
APP_MODE               # production / development / testing (default: production)
APP_CONNECT            # COMMANDO / REST (default: COMMANDO)

# Core Lightning
LIGHTNING_HOST         # CLN IP address (default: localhost)
LIGHTNING_VARS_FILE    # Path to file with LIGHTNING_PUBKEY & LIGHTNING_RUNE

# Commando (WebSocket)
LIGHTNING_WS_PORT      # WebSocket port (default: 5001)

# REST
LIGHTNING_REST_PORT    # REST server port (default: 3010)
```

Environment variables take precedence over `config.json` values. Full variable reference available in the [upstream documentation](https://github.com/ElementsProject/cln-application).

</details>

## Related Projects

| Project | Description |
|---------|-------------|
| [SuperScalar](https://github.com/8144225309/SuperScalar) | Reference implementation of the SuperScalar protocol |
| [superscalar-cln](https://github.com/8144225309/superscalar-cln) | Core Lightning plugin for SuperScalar channel factories |
| [superscalar-docs](https://github.com/8144225309/superscalar-docs) | Protocol documentation and visual guides |
| [superscalar.win](https://superscalar.win) | SuperScalar explainer and documentation site |

## Contributing

Contributions are welcome. Please [open an issue](https://github.com/8144225309/superscalar-wallet/issues/new) before submitting a pull request to discuss the approach.

See [Contributing](./.github/docs/Contributing.md) for development setup and [Troubleshooting](./.github/docs/Troubleshooting.md) for connection debugging.

## License

This project is forked from [cln-application](https://github.com/ElementsProject/cln-application) by Blockstream. See [LICENSE](./LICENSE) for details.
