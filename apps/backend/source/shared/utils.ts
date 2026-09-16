import jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { promisify } from 'util';
import { logger } from '../shared/logger.js';
import {
  APP_CONSTANTS,
  GRPC_CONFIG,
  REST_CONFIG,
  LN_MESSAGE_CONFIG,
  SECRET_KEY,
  AppConnect,
  DEFAULT_ENV_VALUES,
  SESSION_TTL_SECONDS,
} from '../shared/consts.js';

export function addServerConfig(config: any) {
  config.serverConfig = {
    appConnect: APP_CONSTANTS.APP_CONNECT,
    appPort: APP_CONSTANTS.APP_PORT,
    appProtocol: APP_CONSTANTS.APP_PROTOCOL,
    appVersion: APP_CONSTANTS.APP_VERSION,
    singleSignOn: APP_CONSTANTS.APP_SINGLE_SIGN_ON,
  };
  return config;
}

export function createSessionToken() {
  return jwt.sign({ userID: crypto.randomUUID() }, SECRET_KEY, {
    algorithm: 'HS256',
    expiresIn: SESSION_TTL_SECONDS,
  });
}

export function isAuthenticated(token: string) {
  try {
    if (!token) {
      return 'Token missing';
    }
    try {
      const decoded: any = jwt.verify(token, SECRET_KEY, { algorithms: ['HS256'] });
      return !!decoded.userID;
    } catch (error: any) {
      return error.message || 'Invalid user';
    }
  } catch (error: any) {
    return error;
  }
}

export function safeCompare(expected: unknown, actual: unknown): boolean {
  if (typeof expected !== 'string' || typeof actual !== 'string') {
    return false;
  }
  const expectedBuf = Buffer.from(expected, 'utf8');
  const actualBuf = Buffer.from(actual, 'utf8');
  if (expectedBuf.length !== actualBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}

// Entries without the prefix are legacy values written before server-side hashing
// and are upgraded in place the first time they verify successfully.
const SCRYPT_PREFIX = 'scrypt';
const SCRYPT_COST = 16384;
const SCRYPT_KEYLEN = 64;
const scrypt = promisify(crypto.scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: crypto.ScryptOptions,
) => Promise<Buffer>;

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  const hash = await scrypt(password, salt, SCRYPT_KEYLEN, { N: SCRYPT_COST });
  return [SCRYPT_PREFIX, SCRYPT_COST, salt.toString('hex'), hash.toString('hex')].join('$');
}

export async function verifyStoredPassword(
  stored: unknown,
  candidate: unknown,
): Promise<{ ok: boolean; needsUpgrade: boolean }> {
  if (typeof stored !== 'string' || typeof candidate !== 'string' || stored === '') {
    return { ok: false, needsUpgrade: false };
  }
  const parts = stored.split('$');
  if (parts.length === 4 && parts[0] === SCRYPT_PREFIX) {
    const cost = Number(parts[1]);
    const salt = Buffer.from(parts[2], 'hex');
    const expected = Buffer.from(parts[3], 'hex');
    if (!Number.isInteger(cost) || salt.length === 0 || expected.length === 0) {
      return { ok: false, needsUpgrade: false };
    }
    const actual = await scrypt(candidate, salt, expected.length, { N: cost });
    return { ok: crypto.timingSafeEqual(expected, actual), needsUpgrade: false };
  }
  const ok = safeCompare(stored, candidate);
  return { ok, needsUpgrade: ok };
}

export async function verifyPassword(password: string) {
  if (fs.existsSync(APP_CONSTANTS.APP_CONFIG_FILE)) {
    try {
      const config = JSON.parse(fs.readFileSync(APP_CONSTANTS.APP_CONFIG_FILE, 'utf-8'));
      const { ok, needsUpgrade } = await verifyStoredPassword(config.password, password);
      if (!ok) {
        return 'Incorrect password';
      }
      if (needsUpgrade) {
        config.password = await hashPassword(password);
        fs.writeFileSync(APP_CONSTANTS.APP_CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
        logger.info('Stored password upgraded to scrypt');
      }
      return true;
    } catch (error: any) {
      return error;
    }
  } else {
    return 'Config file does not exist to verify the password';
  }
}

export function isValidPassword() {
  if (fs.existsSync(APP_CONSTANTS.APP_CONFIG_FILE)) {
    try {
      const config = JSON.parse(fs.readFileSync(APP_CONSTANTS.APP_CONFIG_FILE, 'utf-8'));
      if (config.password && config.password !== '') {
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      return error;
    }
  } else {
    return 'Config file does not exist to validate the password';
  }
}

function parseEnvFile(filePath: string): { [key: string]: string } {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const envVars: { [key: string]: string } = {};

    for (let line of lines) {
      line = line.trim();
      if (line && line.indexOf('=') !== -1 && !line.startsWith('#')) {
        const [key, ...value] = line.split('=');
        envVars[key] = value.join('=').replace(/(^"|"$)/g, '');
      }
    }

    return envVars;
  } catch (err) {
    logger.error('Error reading .commando-env file:', err);
    return {};
  }
}

export function setEnvVariables() {
  if (fs.existsSync(APP_CONSTANTS.LIGHTNING_VARS_FILE)) {
    const configVars = parseEnvFile(APP_CONSTANTS.LIGHTNING_VARS_FILE);
    process.env.NODE_PUBKEY = configVars.LIGHTNING_PUBKEY || '';
    process.env.ADMIN_RUNE = configVars.LIGHTNING_RUNE || '';
    process.env.INVOICE_RUNE = configVars.INVOICE_RUNE || '';
    APP_CONSTANTS.NODE_PUBKEY = configVars.LIGHTNING_PUBKEY || '';
    APP_CONSTANTS.ADMIN_RUNE = configVars.LIGHTNING_RUNE || '';
    APP_CONSTANTS.INVOICE_RUNE = configVars.INVOICE_RUNE || '';
    LN_MESSAGE_CONFIG.remoteNodePublicKey = configVars.LIGHTNING_PUBKEY || '';
    GRPC_CONFIG.pubkey = configVars.LIGHTNING_PUBKEY;
    REST_CONFIG.rune = configVars.LIGHTNING_RUNE || '';
  }
  if (fs.existsSync('package.json')) {
    const packageData = Buffer.from(fs.readFileSync('package.json')).toString();
    APP_CONSTANTS.APP_VERSION = JSON.parse(packageData).version;
  }
  try {
    if (APP_CONSTANTS.LIGHTNING_WS_PROTOCOL === 'wss') {
      if (fs.existsSync(APP_CONSTANTS.LIGHTNING_WS_CLIENT_KEY_FILE)) {
        LN_MESSAGE_CONFIG.wssClientKey = fs
          .readFileSync(APP_CONSTANTS.LIGHTNING_WS_CLIENT_KEY_FILE)
          .toString();
      }
      if (fs.existsSync(APP_CONSTANTS.LIGHTNING_WS_CLIENT_CERT_FILE)) {
        LN_MESSAGE_CONFIG.wssClientCert = fs
          .readFileSync(APP_CONSTANTS.LIGHTNING_WS_CLIENT_CERT_FILE)
          .toString();
      }
      if (fs.existsSync(APP_CONSTANTS.LIGHTNING_WS_CA_CERT_FILE)) {
        LN_MESSAGE_CONFIG.wssCaCert = fs
          .readFileSync(APP_CONSTANTS.LIGHTNING_WS_CA_CERT_FILE)
          .toString();
      }
    }
    APP_CONSTANTS.LIGHTNING_WS_TLS_CERTS = encodeURIComponent(
      btoa(
        `client_key: ${LN_MESSAGE_CONFIG.wssClientKey}\nclient_cert: ${LN_MESSAGE_CONFIG.wssClientCert}\nca_cert: ${LN_MESSAGE_CONFIG.wssCaCert}`,
      ),
    );
  } catch (error: any) {
    logger.error('Error reading wss proxy certs: ', error);
  }
  try {
    if (APP_CONSTANTS.LIGHTNING_REST_PROTOCOL === 'https') {
      if (fs.existsSync(APP_CONSTANTS.LIGHTNING_REST_CLIENT_KEY_FILE)) {
        REST_CONFIG.restClientKey = fs
          .readFileSync(APP_CONSTANTS.LIGHTNING_REST_CLIENT_KEY_FILE)
          .toString();
      }
      if (fs.existsSync(APP_CONSTANTS.LIGHTNING_REST_CLIENT_CERT_FILE)) {
        REST_CONFIG.restClientCert = fs
          .readFileSync(APP_CONSTANTS.LIGHTNING_REST_CLIENT_CERT_FILE)
          .toString();
      }
      if (fs.existsSync(APP_CONSTANTS.LIGHTNING_REST_CA_CERT_FILE)) {
        REST_CONFIG.restCaCert = fs
          .readFileSync(APP_CONSTANTS.LIGHTNING_REST_CA_CERT_FILE)
          .toString();
      }
      APP_CONSTANTS.LIGHTNING_REST_TLS_CERTS = encodeURIComponent(
        btoa(
          `client_key: ${REST_CONFIG.restClientKey}\nclient_cert: ${REST_CONFIG.restClientCert}\nca_cert: ${REST_CONFIG.restCaCert}`,
        ),
      );
    }
  } catch (error: any) {
    logger.error('Error reading REST certs: ', error);
  }
  try {
    if (fs.existsSync(APP_CONSTANTS.LIGHTNING_GRPC_CLIENT_KEY_FILE)) {
      GRPC_CONFIG.grpcClientKey = fs
        .readFileSync(APP_CONSTANTS.LIGHTNING_GRPC_CLIENT_KEY_FILE)
        .toString();
    }
    if (fs.existsSync(APP_CONSTANTS.LIGHTNING_GRPC_CLIENT_CERT_FILE)) {
      GRPC_CONFIG.grpcClientCert = fs
        .readFileSync(APP_CONSTANTS.LIGHTNING_GRPC_CLIENT_CERT_FILE)
        .toString();
    }
    if (fs.existsSync(APP_CONSTANTS.LIGHTNING_GRPC_CA_CERT_FILE)) {
      GRPC_CONFIG.grpcCaCert = fs
        .readFileSync(APP_CONSTANTS.LIGHTNING_GRPC_CA_CERT_FILE)
        .toString();
    }
    APP_CONSTANTS.LIGHTNING_GRPC_TLS_CERTS = encodeURIComponent(
      btoa(
        `client_key: ${GRPC_CONFIG.grpcClientKey}\nclient_cert: ${GRPC_CONFIG.grpcClientCert}\nca_cert: ${GRPC_CONFIG.grpcCaCert}`,
      ),
    );
  } catch (error: any) {
    logger.error('Error reading gRPC certs: ', error);
  }
  logger.info('Environment variables set successfully');
}

export function validateCommandoConfig() {
  if (LN_MESSAGE_CONFIG.remoteNodePublicKey === '') {
    throw `Node Public Key is not set for Commando connection. Fix LIGHTNING_PUBKEY in ${APP_CONSTANTS.LIGHTNING_VARS_FILE}.`;
  }
  if (APP_CONSTANTS.ADMIN_RUNE === '') {
    throw `Rune is not set for Commando connection. Fix LIGHTNING_RUNE in ${APP_CONSTANTS.LIGHTNING_VARS_FILE}.`;
  }
  if (APP_CONSTANTS.LIGHTNING_WS_PROTOCOL === 'wss') {
    if (LN_MESSAGE_CONFIG.wssClientKey === '') {
      throw `Missing or Invalid WSS Client Key at ${APP_CONSTANTS.LIGHTNING_WS_CLIENT_KEY_FILE}.`;
    }
    if (LN_MESSAGE_CONFIG.wssClientCert === '') {
      throw `Missing or Invalid WSS Client Certificate at ${APP_CONSTANTS.LIGHTNING_WS_CLIENT_CERT_FILE}.`;
    }
  }
}

export function validateRestConfig() {
  if (APP_CONSTANTS.ADMIN_RUNE === '') {
    throw `Rune is not set for REST connection. Fix LIGHTNING_RUNE in ${APP_CONSTANTS.LIGHTNING_VARS_FILE}.`;
  }
  if (APP_CONSTANTS.LIGHTNING_REST_PROTOCOL === 'https' && REST_CONFIG.restCaCert === '') {
    throw `Missing or Invalid REST Ca Certificate at ${APP_CONSTANTS.LIGHTNING_REST_CA_CERT_FILE}.`;
  }
}

export function validateGrpcConfig() {
  if (GRPC_CONFIG.pubkey === '') {
    throw `Node Public Key is not set for GRPC connection. Fix LIGHTNING_PUBKEY in ${APP_CONSTANTS.LIGHTNING_VARS_FILE}.`;
  }
  if (GRPC_CONFIG.grpcClientKey === '') {
    throw `Missing or Invalid gRPC Client Key at ${APP_CONSTANTS.LIGHTNING_GRPC_CLIENT_KEY_FILE}.`;
  }
  if (GRPC_CONFIG.grpcClientCert === '') {
    throw `Missing or Invalid gRPC Client Certificate at ${APP_CONSTANTS.LIGHTNING_GRPC_CLIENT_CERT_FILE}.`;
  }
  if (GRPC_CONFIG.grpcCaCert === '') {
    throw `Missing or Invalid gRPC Ca Certificate at ${APP_CONSTANTS.LIGHTNING_GRPC_CA_CERT_FILE}.`;
  }
}

export function logDefaultValues() {
  for (const [key, value] of Object.entries(DEFAULT_ENV_VALUES)) {
    const envKey = key as keyof typeof APP_CONSTANTS;
    if (!process.env[envKey] && APP_CONSTANTS[envKey] === value) {
      logger.warn(
        `${key} is defaulting to '${value}'. Configure as environment variable to override.`,
      );
    }
  }
}

export function validateEnvVariables() {
  if (!fs.existsSync(APP_CONSTANTS.LIGHTNING_VARS_FILE)) {
    throw `LIGHTNING_VARS_FILE ${APP_CONSTANTS.LIGHTNING_VARS_FILE} does not exist. Create a file with the required variables LIGHTNING_PUBKEY and LIGHTNING_RUNE. See https://github.com/ElementsProject/cln-application?tab=readme-ov-file#commando-authentication for more details.`;
  }
  if (APP_CONSTANTS.NODE_PUBKEY === '') {
    throw `LIGHTNING_PUBKEY is not set in ${APP_CONSTANTS.LIGHTNING_VARS_FILE} file.`;
  }
  if (APP_CONSTANTS.ADMIN_RUNE === '') {
    throw `LIGHTNING_RUNE is not set in ${APP_CONSTANTS.LIGHTNING_VARS_FILE} file.`;
  }
  switch (APP_CONSTANTS.APP_CONNECT) {
    case AppConnect.REST:
      validateRestConfig();
      break;
    case AppConnect.GRPC:
      validateGrpcConfig();
      break;
    default:
      validateCommandoConfig();
      break;
  }
  logDefaultValues();
}
