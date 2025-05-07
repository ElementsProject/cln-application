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

export enum NodeType {
  CLN = 'CLN',
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
  GRPC_UNKNOWN = 552,
}

export const SECRET_KEY = crypto.randomBytes(64).toString('hex');

export const APP_CONSTANTS = {
  SINGLE_SIGN_ON: process.env.SINGLE_SIGN_ON || 'false',
  LOCAL_HOST: process.env.LOCAL_HOST || '',
  DEVICE_DOMAIN_NAME: process.env.DEVICE_DOMAIN_NAME || '',
  BITCOIN_NODE_IP: process.env.BITCOIN_NODE_IP || 'localhost',
  BITCOIN_NETWORK: process.env.BITCOIN_NETWORK || 'bitcoin',
  APP_CONFIG_FILE: join(process.env.APP_CONFIG_DIR || '.', 'config.json'),
  APP_LOG_FILE: join(process.env.APP_CONFIG_DIR || '.', 'application-cln.log'),
  APP_MODE: process.env.APP_MODE || Environment.PRODUCTION,
  APP_CONNECT: process.env.APP_CONNECT || AppConnect.COMMANDO,
  APP_PROTOCOL: process.env.APP_PROTOCOL || 'http',
  APP_IP: process.env.APP_IP || 'localhost',
  APP_PORT: process.env.APP_PORT || '2103',
  LIGHTNING_IP: process.env.LIGHTNING_IP || process.env.APP_CORE_LIGHTNING_DAEMON_IP || 'localhost',
  LIGHTNING_PATH: process.env.LIGHTNING_PATH || '',
  HIDDEN_SERVICE_URL: process.env.HIDDEN_SERVICE_URL || '',
  LIGHTNING_NODE_TYPE: process.env.LIGHTNING_NODE_TYPE || NodeType.CLN,
  COMMANDO_CONFIG: process.env.COMMANDO_CONFIG || './.commando-env',
  LIGHTNING_WS_PORT: +(
    process.env.LIGHTNING_WEBSOCKET_PORT ||
    process.env.APP_CORE_LIGHTNING_WEBSOCKET_PORT ||
    5001
  ),
  LIGHTNING_REST_PROTOCOL:
    process.env.LIGHTNING_REST_PROTOCOL || process.env.APP_CORE_LIGHTNING_REST_PROTOCOL || 'https',
  LIGHTNING_REST_PORT: +(
    process.env.LIGHTNING_REST_PORT ||
    process.env.APP_CORE_LIGHTNING_REST_PORT ||
    3010
  ),
  LIGHTNING_CERTS_PATH: process.env.LIGHTNING_CERTS_PATH || '',
  LIGHTNING_GRPC_PROTOCOL:
    process.env.LIGHTNING_GRPC_PROTOCOL ||
    process.env.APP_CORE_LIGHTNING_DAEMON_GRPC_PROTOCOL ||
    'http',
  LIGHTNING_GRPC_PORT: +(
    process.env.LIGHTNING_GRPC_PORT ||
    process.env.APP_CORE_LIGHTNING_DAEMON_GRPC_PORT ||
    9736
  ),
  APP_VERSION: '',
  NODE_PUBKEY: '',
  COMMANDO_RUNE: '',
  INVOICE_RUNE: '',
  CLIENT_KEY: '',
  CLIENT_CERT: '',
  CA_CERT: '',
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
  wsProxy: 'ws://' + APP_CONSTANTS.LIGHTNING_IP + ':' + APP_CONSTANTS.LIGHTNING_WS_PORT,
  ip: APP_CONSTANTS.LIGHTNING_IP,
  port: APP_CONSTANTS.LIGHTNING_WS_PORT,
  privateKey: crypto.randomBytes(32).toString('hex'),
  logger: {
    info: APP_CONSTANTS.APP_MODE === Environment.PRODUCTION ? () => {} : console.info,
    warn: APP_CONSTANTS.APP_MODE === Environment.PRODUCTION ? () => {} : console.warn,
    error: console.error,
  },
};

export const GRPC_CONFIG = {
  pubkey: APP_CONSTANTS.NODE_PUBKEY,
  protocol: APP_CONSTANTS.LIGHTNING_GRPC_PROTOCOL,
  ip: APP_CONSTANTS.LIGHTNING_IP,
  port: APP_CONSTANTS.LIGHTNING_GRPC_PORT,
  url:
    APP_CONSTANTS.LIGHTNING_GRPC_PROTOCOL +
    '://' +
    APP_CONSTANTS.LIGHTNING_IP +
    ':' +
    APP_CONSTANTS.LIGHTNING_GRPC_PORT,
};

export const REST_CONFIG = {
  protocol: APP_CONSTANTS.LIGHTNING_REST_PROTOCOL,
  ip: APP_CONSTANTS.LIGHTNING_IP,
  port: APP_CONSTANTS.LIGHTNING_REST_PORT,
  url:
    APP_CONSTANTS.LIGHTNING_REST_PROTOCOL +
    '://' +
    APP_CONSTANTS.LIGHTNING_IP +
    ':' +
    APP_CONSTANTS.LIGHTNING_REST_PORT,
};

export const API_VERSION = '/v1';
export const FIAT_RATE_API = 'https://green-bitcoin-mainnet.blockstream.com/prices/v0/venues/';
export const FIAT_VENUES: any = {
  USD: 'KRAKEN',
  EUR: 'KRAKEN',
  NZD: 'KIWICOIN',
};
