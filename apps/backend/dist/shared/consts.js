import * as crypto from 'crypto';
import { join } from 'path';
export var Environment;
(function (Environment) {
    Environment["PRODUCTION"] = "production";
    Environment["TESTING"] = "testing";
    Environment["DEVELOPMENT"] = "development";
})(Environment || (Environment = {}));
export var HttpStatusCode;
(function (HttpStatusCode) {
    HttpStatusCode[HttpStatusCode["GET_OK"] = 200] = "GET_OK";
    HttpStatusCode[HttpStatusCode["POST_OK"] = 201] = "POST_OK";
    HttpStatusCode[HttpStatusCode["DELETE_OK"] = 204] = "DELETE_OK";
    HttpStatusCode[HttpStatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatusCode[HttpStatusCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpStatusCode[HttpStatusCode["BAD_CSRF_TOKEN"] = 403] = "BAD_CSRF_TOKEN";
    HttpStatusCode[HttpStatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatusCode[HttpStatusCode["ACCESS_DENIED"] = 406] = "ACCESS_DENIED";
    HttpStatusCode[HttpStatusCode["ADDR_IN_USE"] = 409] = "ADDR_IN_USE";
    HttpStatusCode[HttpStatusCode["INVALID_DATA"] = 421] = "INVALID_DATA";
    HttpStatusCode[HttpStatusCode["INTERNAL_SERVER"] = 500] = "INTERNAL_SERVER";
    HttpStatusCode[HttpStatusCode["BITCOIN_SERVER"] = 520] = "BITCOIN_SERVER";
    HttpStatusCode[HttpStatusCode["LIGHTNING_SERVER"] = 521] = "LIGHTNING_SERVER";
})(HttpStatusCode || (HttpStatusCode = {}));
export const SECRET_KEY = crypto.randomBytes(64).toString('hex');
export const APP_CONSTANTS = {
    COMMANDO_RUNE: '',
    APP_CORE_LIGHTNING_DAEMON_IP: process.env.APP_CORE_LIGHTNING_DAEMON_IP || 'localhost',
    LIGHTNING_WS_PORT: +(process.env.APP_CORE_LIGHTNING_WEBSOCKET_PORT || 5001),
    APP_MODE: process.env.APP_MODE || Environment.PRODUCTION,
    COMMANDO_ENV_LOCATION: process.env.COMMANDO_CONFIG || './.commando-env',
    MACAROON_PATH: join(process.env.APP_CORE_LIGHTNING_REST_CERT_DIR || '.', 'access.macaroon'),
    LOG_FILE_LOCATION: join(process.env.APP_CONFIG_DIR || '.', 'application-cln.log'),
    CONFIG_LOCATION: join(process.env.APP_CONFIG_DIR || '.', 'config.json'),
};
export const DEFAULT_CONFIG = {
    unit: 'SATS',
    fiatUnit: 'USD',
    appMode: 'DARK',
    isLoading: false,
    error: null,
    sso: false,
    password: '',
};
export const LN_MESSAGE_CONFIG = {
    remoteNodePublicKey: '',
    wsProxy: 'ws://' + APP_CONSTANTS.APP_CORE_LIGHTNING_DAEMON_IP + ':' + APP_CONSTANTS.LIGHTNING_WS_PORT,
    ip: APP_CONSTANTS.APP_CORE_LIGHTNING_DAEMON_IP,
    port: APP_CONSTANTS.LIGHTNING_WS_PORT,
    privateKey: crypto.randomBytes(32).toString('hex'),
    logger: {
        info: APP_CONSTANTS.APP_MODE === Environment.PRODUCTION ? () => { } : console.info,
        warn: APP_CONSTANTS.APP_MODE === Environment.PRODUCTION ? () => { } : console.warn,
        error: console.error,
    },
};
export const API_VERSION = '/v1';
export const FIAT_RATE_API = 'https://green-bitcoin-mainnet.blockstream.com/prices/v0/venues/';
export const FIAT_VENUES = {
    USD: 'KRAKEN',
    CAD: 'BULLBITCOIN',
    EUR: 'KRAKEN',
    NZD: 'KIWICOIN',
};
