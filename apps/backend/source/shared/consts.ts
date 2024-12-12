import * as crypto from 'crypto';
import { join } from 'path';

export enum Environment {
  PRODUCTION = 'production',
  TESTING = 'testing',
  DEVELOPMENT = 'development',
}

export enum AppConnect {
  COMMANDO = 'COMMANDO',
  REST = 'REST',
  GRPC = 'GRPC',
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

export const SECRET_KEY = crypto.randomBytes(64).toString('hex');

export const APP_CONSTANTS = {
  COMMANDO_RUNE: '',
  COMMANDO_ENV_LOCATION: process.env.COMMANDO_CONFIG || './.commando-env',
  APP_MODE: process.env.APP_MODE || Environment.PRODUCTION,
  MACAROON_PATH: join(process.env.APP_CORE_LIGHTNING_REST_CERT_DIR || '.', 'access.macaroon'),
  LOG_FILE_LOCATION: join(process.env.APP_CONFIG_DIR || '.', 'application-cln.log'),
  CONFIG_LOCATION: join(process.env.APP_CONFIG_DIR || '.', 'config.json'),
  APP_CONNECT: process.env.APP_CONNECT || AppConnect.COMMANDO,
  APP_CORE_LIGHTNING_DAEMON_IP: process.env.APP_CORE_LIGHTNING_DAEMON_IP || 'localhost',
  LIGHTNING_WS_PORT: +(process.env.APP_CORE_LIGHTNING_WEBSOCKET_PORT || 5001),
  LIGHTNING_REST_PROTOCOL: process.env.APP_CORE_LIGHTNING_REST_PROTOCOL || 'https',
  LIGHTNING_REST_PORT: +(process.env.APP_CORE_LIGHTNING_REST_PORT || 3010),
  LIGHTNING_GRPC_PROTOCOL: process.env.APP_CORE_LIGHTNING_DAEMON_GRPC_PROTOCOL || 'https',
  LIGHTNING_GRPC_PORT: +(process.env.APP_CORE_LIGHTNING_DAEMON_GRPC_PORT || 9736),
};

export const DEFAULT_CONFIG = {
  unit: 'SATS',
  fiatUnit: 'USD',
  appMode: 'DARK',
  isLoading: false,
  error: null,
  singleSignOn: false,
  password: '',
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

export const GRPC_CONFIG = {
  protocol: APP_CONSTANTS.LIGHTNING_GRPC_PROTOCOL,
  ip: APP_CONSTANTS.APP_CORE_LIGHTNING_DAEMON_IP,
  port: APP_CONSTANTS.LIGHTNING_GRPC_PORT,
  url:
    APP_CONSTANTS.LIGHTNING_GRPC_PROTOCOL +
    '://' +
    APP_CONSTANTS.APP_CORE_LIGHTNING_DAEMON_IP +
    ':' +
    APP_CONSTANTS.LIGHTNING_GRPC_PORT,
};

export const REST_CONFIG = {
  protocol: APP_CONSTANTS.LIGHTNING_REST_PROTOCOL,
  ip: APP_CONSTANTS.APP_CORE_LIGHTNING_DAEMON_IP,
  port: APP_CONSTANTS.LIGHTNING_REST_PORT,
  url:
    APP_CONSTANTS.LIGHTNING_REST_PROTOCOL +
    '://' +
    APP_CONSTANTS.APP_CORE_LIGHTNING_DAEMON_IP +
    ':' +
    APP_CONSTANTS.LIGHTNING_REST_PORT,
};

export const API_VERSION = '/v1';
export const FIAT_RATE_API = 'https://green-bitcoin-mainnet.blockstream.com/prices/v0/venues/';
export const FIAT_VENUES: any = {
  USD: 'KRAKEN',
  CAD: 'BULLBITCOIN',
  EUR: 'KRAKEN',
  NZD: 'KIWICOIN',
};
