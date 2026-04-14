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

- [Core Lightning (bLIP-56 fork)](https://github.com/8144225309/lightning/tree/blip-56) — the `blip-56` branch with pluggable channel factory support
- [SuperScalar CLN plugin](https://github.com/8144225309/superscalar-cln) installed and active
- Bitcoin Core 28+, synced to network
- [Node.js](https://nodejs.org/en/download/) 16+
- Recommended browsers: Chrome, Firefox, MS Edge

## Getting Started

### Standalone

```bash
git clone https://github.com/8144225309/superscalar-wallet.git
cd superscalar-wallet
npm ci
npm run build
npm prune --omit=dev
APP_PORT=9876 APP_HOST=0.0.0.0 APP_SINGLE_SIGN_ON=true npm run start
```

### Docker

For Docker deployment with a remote Core Lightning node, see the [Docker Setup Guide](./.github/docs/Docker-Setup.md).

### Configuration

The application connects to Core Lightning via [Commando](https://docs.corelightning.org/reference/lightning-commando) (default) or REST. See [Environment Variables](#environment-variables) for connection options.

Authentication uses [runes](https://docs.corelightning.org/reference/lightning-commando) for trustless, end-to-end encrypted communication. The `entrypoint.sh` script can auto-generate credentials for local installations, or they can be configured manually for remote nodes.

## Multi-Node Setup

The wallet can manage multiple Core Lightning nodes simultaneously. Nodes are **auto-discovered** at startup — no manual configuration required as long as each node meets two requirements:

### Requirements per node

**1. WebSocket binding in CLN config**

Each CLN node must expose a WebSocket port. Add this line to the node's `config` file (use a unique port per node):

```
bind-addr=ws:127.0.0.1:5001
```

Without this, the node is visible on the filesystem but cannot be reached by the dashboard — the scanner will skip it with a warning. This is a Core Lightning/Commando protocol requirement, not a wallet limitation.

**2. Node must be running**

The scanner connects to each node via its Unix socket (`lightning-rpc`) at startup. Stopped nodes leave their socket file on disk but refuse connections and are skipped automatically.

### How discovery works

On every page load the wallet scans `/var/lib/cln*` (and `~/.lightning`) for running CLN nodes, calls `getinfo` via Unix socket, auto-generates a commando rune, reads the WS port from the node's config, and saves the profile to `node-profiles.json`. This is fully automatic — profiles persist across restarts and runes are refreshed on each scan.

To trigger a manual rescan at any time, use the **Rescan for Nodes** option in the node picker dropdown.

### Factory tab visibility

The **Factories** tab only appears when the active node has the SuperScalar plugin loaded (`factory-list` returns successfully). On vanilla CLN nodes the tab is hidden automatically.

### Bookkeeper (transaction history)

BTC transaction history requires the CLN `bookkeeper` plugin to be enabled (it is by default). If you see "Failed to load transactions", check that bookkeeper is not disabled in the node's config:

```
# This line disables transaction history — remove it if you want BTC tx history:
# disable-plugin=bookkeeper
```

Note: on a freshly started node, bookkeeper may take 10–30 seconds to finish its initial sync before transaction queries become available.

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
| [superscalar-cln](https://github.com/8144225309/superscalar-cln) | SuperScalar channel factory plugin for Core Lightning (bLIP-56) |
| [lightning (bLIP-56 fork)](https://github.com/8144225309/lightning/tree/blip-56) | Core Lightning fork with pluggable channel factory support |
| [superscalar-docs](https://github.com/8144225309/superscalar-docs) | Protocol documentation and visual guides |
| [superscalar.win](https://superscalar.win) | SuperScalar explainer and documentation site |

## Contributing

Contributions are welcome. Please [open an issue](https://github.com/8144225309/superscalar-wallet/issues/new) before submitting a pull request to discuss the approach.

See [Contributing](./.github/docs/Contributing.md) for development setup and [Troubleshooting](./.github/docs/Troubleshooting.md) for connection debugging.

## License

This project is forked from [cln-application](https://github.com/ElementsProject/cln-application) by Blockstream. See [LICENSE](./LICENSE) for details.
