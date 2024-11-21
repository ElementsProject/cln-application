import * as fs from 'fs';
import * as crypto from 'crypto';
import axios from 'axios';
import Lnmessage from 'lnmessage';
import { LightningError } from '../models/errors.js';
import {
  HttpStatusCode,
  APP_CONSTANTS,
  AppConnect,
  LN_MESSAGE_CONFIG,
  REST_CONFIG,
  GRPC_CONFIG,
} from '../shared/consts.js';
import { logger } from '../shared/logger.js';
import { readFileSync } from 'fs';

export class LightningService {
  private clnService: any = null;

  constructor() {
    try {
      logger.info('Getting Commando Rune');
      if (fs.existsSync(APP_CONSTANTS.COMMANDO_ENV_LOCATION)) {
        this.refreshEnvVariables();
        switch (APP_CONSTANTS.APP_CONNECT) {
          case AppConnect.REST:
            logger.info('REST connecting with config: ' + JSON.stringify(REST_CONFIG));
            break;
          case AppConnect.GRPC:
            logger.info('GRPC connecting with config: ' + JSON.stringify(GRPC_CONFIG));
            break;
          default:
            logger.info('lnMessage connecting with config: ' + JSON.stringify(LN_MESSAGE_CONFIG));
            this.clnService = new Lnmessage(LN_MESSAGE_CONFIG);
            this.clnService.connect();
            break;
        }
      }
    } catch (error: any) {
      logger.error('Failed to read rune for Commando connection: ' + JSON.stringify(error));
      throw error;
    }
  }

  getLNMsgPubkey = () => {
    return this.clnService.publicKey;
  };

  call = async (method: string, methodParams: any[]) => {
    switch (APP_CONSTANTS.APP_CONNECT) {
      case AppConnect.REST:
        return axios
          .post(REST_CONFIG.url + '/v1/' + method, methodParams, {
            headers: { rune: APP_CONSTANTS.COMMANDO_RUNE },
          })
          .then((commandRes: any) => {
            logger.info('REST response for ' + method + ': ' + JSON.stringify(commandRes.data));
            return Promise.resolve(commandRes.data);
          })
          .catch((err: any) => {
            logger.error('REST lightning error from ' + method + ' command');
            if (typeof err === 'string') {
              logger.error(err);
              throw new LightningError(
                err,
                err,
                HttpStatusCode.LIGHTNING_SERVER,
                'Core Lightning API Error',
              );
            } else {
              logger.error(JSON.stringify(err));
              throw new LightningError(
                err.response?.data?.message || err.message || err.error,
                err.response?.data || err.error || err.message,
                HttpStatusCode.LIGHTNING_SERVER,
                'Core Lightning API Error',
              );
            }
          });
      case AppConnect.GRPC:
        break;
      default:
        return this.clnService
          .commando({
            method: method,
            params: methodParams,
            rune: APP_CONSTANTS.COMMANDO_RUNE,
            reqId: crypto.randomBytes(8).toString('hex'),
            reqIdPrefix: 'clnapp',
          })
          .then((commandRes: any) => {
            logger.info('Commando response for ' + method + ': ' + JSON.stringify(commandRes));
            return Promise.resolve(commandRes);
          })
          .catch((err: any) => {
            logger.error('Commando lightning error from ' + method + ' command');
            if (typeof err === 'string') {
              logger.error(err);
              throw new LightningError(
                err,
                err,
                HttpStatusCode.LIGHTNING_SERVER,
                'Core Lightning API Error',
              );
            } else {
              logger.error(JSON.stringify(err));
              throw new LightningError(
                err.message || err.error,
                err.error || err.message,
                HttpStatusCode.LIGHTNING_SERVER,
                'Core Lightning API Error',
              );
            }
          });
    }
  };

  refreshEnvVariables() {
    const envVars = this.parseEnvFile(APP_CONSTANTS.COMMANDO_ENV_LOCATION);

    process.env.LIGHTNING_PUBKEY = envVars.LIGHTNING_PUBKEY;
    process.env.COMMANDO_RUNE = envVars.LIGHTNING_RUNE;
    process.env.INVOICE_RUNE = envVars.INVOICE_RUNE !== undefined ? envVars.INVOICE_RUNE : '';
    LN_MESSAGE_CONFIG.remoteNodePublicKey = process.env.LIGHTNING_PUBKEY;
    APP_CONSTANTS.COMMANDO_RUNE = process.env.COMMANDO_RUNE;
  }

  private parseEnvFile(filePath: string): { [key: string]: string } {
    try {
      const content = readFileSync(filePath, 'utf8');
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
}

export const CLNService = new LightningService();
