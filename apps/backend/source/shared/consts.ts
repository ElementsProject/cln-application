import * as crypto from 'crypto';
import { join } from 'path';

export enum Environment {
  PRODUCTION = 'production',
  TESTING = 'testing',
  DEVELOPMENT = 'development',
}

export enum HttpStatusCode {
  GET_OK = 200,
  POST_OK = 201,
  DELETE_OK = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  BAD_CSRF_TOKEN = 403,
  NOT_FOUND = 404,
  ACCESS_DENIED = 406,
  ADDR_IN_USE = 409,
  INVALID_DATA = 421,
  INTERNAL_SERVER = 500,
  BITCOIN_SERVER = 520,
  LIGHTNING_SERVER = 521,
}

export const APP_CONSTANTS = {
  COMMANDO_RUNE: '',
  APP_CORE_LIGHTNING_DAEMON_IP: process.env.APP_CORE_LIGHTNING_DAEMON_IP || 'localhost',
  LIGHTNING_WS_PORT: +(process.env.APP_CORE_LIGHTNING_WEBSOCKET_PORT || 5001),
  APP_MODE: process.env.APP_MODE || Environment.PRODUCTION,
  COMMANDO_ENV_LOCATION: join(
    process.env.APP_CORE_LIGHTNING_COMMANDO_ENV_DIR || '.',
    '.commando-env',
  ),
  MACAROON_PATH: join(process.env.APP_CORE_LIGHTNING_REST_CERT_DIR || '.', 'access.macaroon'),
  LOG_FILE_LOCATION: join(process.env.APP_CONFIG_DIR || '.', 'application-cln.log'),
  CONFIG_LOCATION: join(process.env.APP_CONFIG_DIR || '.', 'config.json'),
};

export const DEFAULT_CONFIG = {
  "unit": "SATS",
  "fiatUnit": "USD",
  "appMode": "DARK",
  "isLoading": false,
  "error": null
};

export const LN_MESSAGE_CONFIG = {
  remoteNodePublicKey: '',
  wsProxy:
    'ws://' + APP_CONSTANTS.APP_CORE_LIGHTNING_DAEMON_IP + ':' + APP_CONSTANTS.LIGHTNING_WS_PORT,
  ip: APP_CONSTANTS.APP_CORE_LIGHTNING_DAEMON_IP,
  port: APP_CONSTANTS.LIGHTNING_WS_PORT,
  privateKey: crypto.randomBytes(32).toString('hex'),
  logger: {
    info: APP_CONSTANTS.APP_MODE === Environment.PRODUCTION ? () => {} : console.info,
    warn: APP_CONSTANTS.APP_MODE === Environment.PRODUCTION ? () => {} : console.warn,
    error: console.error,
  },
};

export const API_VERSION = '/v1';
export const FIAT_RATE_API = 'https://green-bitcoin-mainnet.blockstream.com/prices/v0/venues/';
export const FIAT_VENUES: any = {
  USD: 'KRAKEN',
  CAD: 'BULLBITCOIN',
  EUR: 'KRAKEN',
  NZD: 'KIWICOIN',
};
