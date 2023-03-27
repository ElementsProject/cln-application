import Lnmessage from 'lnmessage';
import * as fs from 'fs';
import { LightningError } from '../models/errors.js';
import { HttpStatusCode, APP_CONSTANTS, LN_MESSAGE_CONFIG } from '../shared/consts.js';
import { logger } from '../shared/logger.js';

export class LightningService {
  private lnMessage: any = null;

  constructor() {
    try {
      logger.info('Getting Commando Rune');
      if (fs.existsSync(APP_CONSTANTS.COMMANDO_ENV_LOCATION)) {
        const DATA_SPLIT = (
          Buffer.from(fs.readFileSync(APP_CONSTANTS.COMMANDO_ENV_LOCATION)).toString() || '\n'
        ).split('\n');
        process.env.LIGHTNING_PUBKEY = DATA_SPLIT[0].substring(18, DATA_SPLIT[0].length - 1);
        process.env.COMMANDO_RUNE = DATA_SPLIT[1].substring(16, DATA_SPLIT[1].length - 1);
        LN_MESSAGE_CONFIG.remoteNodePublicKey = process.env.LIGHTNING_PUBKEY;
        APP_CONSTANTS.COMMANDO_RUNE = process.env.COMMANDO_RUNE;
        logger.info('lnMessage connecting with config: ' + JSON.stringify(LN_MESSAGE_CONFIG));
        this.lnMessage = new Lnmessage(LN_MESSAGE_CONFIG);
        this.lnMessage.connect();
      }
    } catch (error: any) {
      logger.error('Failed to read rune for Commando connection: ' + JSON.stringify(error));
      throw error;
    }
  }

  call = async (method: string, methodParams: any[]) => {
    return this.lnMessage
      .commando({
        method: method,
        params: methodParams,
        rune: APP_CONSTANTS.COMMANDO_RUNE,
      })
      .then((commandRes: any) => {
        logger.info('Command Res for ' + method + ': ' + JSON.stringify(commandRes));
        return Promise.resolve(commandRes);
      })
      .catch((err: any) => {
        logger.error('Lightning error from ' + method + ' command');
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
  };
}

export const LNMessage = new LightningService();
