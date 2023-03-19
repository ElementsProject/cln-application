import Lnmessage from 'lnmessage';
import { LightningError } from '../models/errors.js';
import { HttpStatusCode, APP_CONSTANTS, LN_MESSAGE_CONFIG } from '../shared/consts.js';
import { logger } from '../shared/logger.js';

export class LightningService {
  private lnMessage: any = null;

  constructor() {
    logger.info('lnMessage connecting with config: ' + JSON.stringify(LN_MESSAGE_CONFIG));
    this.lnMessage = new Lnmessage(LN_MESSAGE_CONFIG);
    this.lnMessage.connect();
  }

  call = async (method: string, methodParams: any[]) => {
    return this.lnMessage
      .commando({
        method: method,
        params: methodParams,
        rune: APP_CONSTANTS.CLN_RUNE,
      })
      .then((commandRes: any) => {
        logger.info('Command Res for ' + method + ': ' + JSON.stringify(commandRes));
        return Promise.resolve(commandRes);
      })
      .catch((err: any) => {
        logger.error('Lightning error from ' + method + ' command');
        if (typeof err === 'string') {
          logger.error(err);
          throw new LightningError(err, err, HttpStatusCode.CLN_SERVER, 'Core Lightning API Error');
        } else {
          logger.error(JSON.stringify(err));
          throw new LightningError(
            err.message || err.error,
            err.error || err.message,
            HttpStatusCode.CLN_SERVER,
            'Core Lightning API Error',
          );
        }
      });
  };
}

export const LNMessage = new LightningService();
