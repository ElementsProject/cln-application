import jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { sep } from 'path';
import { logger } from '../shared/logger.js';
import { APP_CONSTANTS, GRPC_CONFIG, LN_MESSAGE_CONFIG, SECRET_KEY } from '../shared/consts.js';

export function addServerConfig(config: any) {
  config.serverConfig = {
    appConnect: APP_CONSTANTS.APP_CONNECT,
    appPort: APP_CONSTANTS.APP_PORT,
    appProtocol: APP_CONSTANTS.APP_PROTOCOL,
    appVersion: APP_CONSTANTS.APP_VERSION,
    lightningNodeType: APP_CONSTANTS.LIGHTNING_NODE_TYPE,
    singleSignOn: APP_CONSTANTS.SINGLE_SIGN_ON,
  };
  return config;
}

export function isAuthenticated(token: string) {
  try {
    if (!token) {
      return 'Token missing';
    }
    try {
      const decoded: any = jwt.verify(token, SECRET_KEY);
      return !!decoded.userID;
    } catch (error: any) {
      return error.message || 'Invalid user';
    }
  } catch (error: any) {
    return error;
  }
}

export function verifyPassword(password: string) {
  if (fs.existsSync(APP_CONSTANTS.APP_CONFIG_FILE)) {
    try {
      const config = JSON.parse(fs.readFileSync(APP_CONSTANTS.APP_CONFIG_FILE, 'utf-8'));
      if (config.password === password) {
        return true;
      } else {
        return 'Incorrect password';
      }
    } catch (error: any) {
      return error;
    }
  } else {
    return 'Config file does not exist';
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
    return 'Config file does not exist';
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

export function refreshEnvVariables() {
  const envVars = parseEnvFile(APP_CONSTANTS.COMMANDO_CONFIG);
  process.env.LIGHTNING_PUBKEY = envVars.LIGHTNING_PUBKEY;
  process.env.COMMANDO_RUNE = envVars.LIGHTNING_RUNE;
  process.env.INVOICE_RUNE = envVars.INVOICE_RUNE || '';
  APP_CONSTANTS.NODE_PUBKEY = envVars.LIGHTNING_PUBKEY;
  APP_CONSTANTS.COMMANDO_RUNE = envVars.LIGHTNING_RUNE;
  APP_CONSTANTS.INVOICE_RUNE = envVars.INVOICE_RUNE || '';
  LN_MESSAGE_CONFIG.remoteNodePublicKey = envVars.LIGHTNING_PUBKEY;
  GRPC_CONFIG.pubkey = envVars.LIGHTNING_PUBKEY;
  if (APP_CONSTANTS.LIGHTNING_CERTS_PATH === '') {
    APP_CONSTANTS.LIGHTNING_CERTS_PATH =
      APP_CONSTANTS.LIGHTNING_PATH + sep + APP_CONSTANTS.BITCOIN_NETWORK + sep;
  }
  let clientKey = '';
  let clientCert = '';
  let caCert = '';
  if (fs.existsSync('package.json')) {
    let packageData = Buffer.from(fs.readFileSync('package.json')).toString();
    APP_CONSTANTS.APP_VERSION = JSON.parse(packageData).version;
  }
  if (fs.existsSync(APP_CONSTANTS.LIGHTNING_CERTS_PATH + 'client-key.pem')) {
    clientKey = fs.readFileSync(APP_CONSTANTS.LIGHTNING_CERTS_PATH + 'client-key.pem').toString();
    APP_CONSTANTS.CLIENT_KEY = clientKey
      .replace(/(\r\n|\n|\r)/gm, '')
      .replace('-----BEGIN PRIVATE KEY-----', '')
      .replace('-----END PRIVATE KEY-----', '');
  }
  if (fs.existsSync(APP_CONSTANTS.LIGHTNING_CERTS_PATH + 'client.pem')) {
    clientCert = fs.readFileSync(APP_CONSTANTS.LIGHTNING_CERTS_PATH + 'client.pem').toString();
    APP_CONSTANTS.CLIENT_CERT = clientCert
      .replace(/(\r\n|\n|\r)/gm, '')
      .replace('-----BEGIN CERTIFICATE-----', '')
      .replace('-----END CERTIFICATE-----', '');
  }
  if (fs.existsSync(APP_CONSTANTS.LIGHTNING_CERTS_PATH + 'ca.pem')) {
    caCert = fs.readFileSync(APP_CONSTANTS.LIGHTNING_CERTS_PATH + 'ca.pem').toString();
    APP_CONSTANTS.CA_CERT = caCert
      .replace(/(\r\n|\n|\r)/gm, '')
      .replace('-----BEGIN CERTIFICATE-----', '')
      .replace('-----END CERTIFICATE-----', '');
  }
}
