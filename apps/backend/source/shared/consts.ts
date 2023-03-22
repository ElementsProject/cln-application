import * as crypto from 'crypto';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

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
  NOT_FOUND = 404,
  INVALID_DATA = 421,
  INTERNAL_SERVER = 500,
  BITCOIN_SERVER = 520,
  CLN_SERVER = 521,
}

export const APP_CONSTANTS = {
  COMMANDO_RUNE: '',
  CLN_HOST_IP: process.env.CLN_DAEMON_IP || 'localhost',
  CLN_WS_PORT: +(process.env.CLN_DAEMON_WS_PORT || 5001),
  APPLICATION_MODE: process.env.APPLICATION_MODE || Environment.PRODUCTION,
  COMMANDO_ENV_LOCATION: join(
    dirname(fileURLToPath(import.meta.url)),
    process.env.APP_DATA_DIR || '.',
    process.env.APPLICATION_MODE === Environment.PRODUCTION ||
      process.env.APPLICATION_MODE === Environment.TESTING
      ? '/root/.lightning/.commando-env'
      : './.commando-env',
  ),
  MACAROON_PATH: join(
    dirname(fileURLToPath(import.meta.url)),
    process.env.APP_DATA_DIR || '.',
    process.env.CLN_REST_CERT_DIR || '.',
    'access.macaroon',
  ),
  LOG_FILE_LOCATION: join(
    dirname(fileURLToPath(import.meta.url)),
    process.env.APP_DATA_DIR || '.',
    '/data/app/application-cln.log',
  ),
  CONFIG_LOCATION: join(
    dirname(fileURLToPath(import.meta.url)),
    process.env.APP_DATA_DIR || '.',
    '/data/app/config.json',
  ),
};

export const LN_MESSAGE_CONFIG = {
  remoteNodePublicKey: '',
  wsProxy: 'ws://' + APP_CONSTANTS.CLN_HOST_IP + ':' + APP_CONSTANTS.CLN_WS_PORT,
  ip: APP_CONSTANTS.CLN_HOST_IP,
  port: APP_CONSTANTS.CLN_WS_PORT,
  privateKey: crypto.randomBytes(32).toString('hex'),
  logger: {
    info: APP_CONSTANTS.APPLICATION_MODE === Environment.PRODUCTION ? () => {} : console.info,
    warn: APP_CONSTANTS.APPLICATION_MODE === Environment.PRODUCTION ? () => {} : console.warn,
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
