import axios from 'axios';
import * as fs from 'fs';
import { Request, Response, NextFunction } from 'express';

import { APP_CONSTANTS, DEFAULT_CONFIG, FIAT_RATE_API, FIAT_VENUES } from '../shared/consts.js';
import { logger } from '../shared/logger.js';
import handleError from '../shared/error-handler.js';
import { APIError } from '../models/errors.js';

class SharedController {
  getApplicationSettings(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Getting Application Settings from ' + APP_CONSTANTS.CONFIG_LOCATION);
      if (!fs.existsSync(APP_CONSTANTS.CONFIG_LOCATION)) {
        fs.writeFileSync(
          APP_CONSTANTS.CONFIG_LOCATION,
          JSON.stringify(DEFAULT_CONFIG, null, 2),
          'utf-8',
        );
      }
      res.status(200).json(JSON.parse(fs.readFileSync(APP_CONSTANTS.CONFIG_LOCATION, 'utf-8')));
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  }

  setApplicationSettings(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Updating Application Settings: ' + JSON.stringify(req.body));
      fs.writeFileSync(APP_CONSTANTS.CONFIG_LOCATION, JSON.stringify(req.body, null, 2), 'utf-8');
      res.status(201).json({ message: 'Application Settings Updated Successfully' });
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  }

  getWalletConnectSettings(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Getting Connection Settings');
      let macaroon = '';
      if (fs.existsSync(APP_CONSTANTS.MACAROON_PATH)) {
        logger.info(
          'Getting REST Access Macaroon from ' + process.env.APP_CORE_LIGHTNING_REST_CERT_DIR,
        );
        macaroon = Buffer.from(fs.readFileSync(APP_CONSTANTS.MACAROON_PATH)).toString('hex');
      }
      const CONNECT_WALLET_SETTINGS = {
        LOCAL_HOST: process.env.LOCAL_HOST || '',
        DEVICE_DOMAIN_NAME: process.env.DEVICE_DOMAIN_NAME || '',
        TOR_HOST: process.env.APP_CORE_LIGHTNING_REST_HIDDEN_SERVICE || '',
        WS_PORT: process.env.APP_CORE_LIGHTNING_WEBSOCKET_PORT || '',
        GRPC_PORT: process.env.APP_CORE_LIGHTNING_DAEMON_GRPC_PORT || '',
        REST_PORT: process.env.APP_CORE_LIGHTNING_REST_PORT || '',
        REST_MACAROON: macaroon,
        CLN_NODE_IP: process.env.APP_CORE_LIGHTNING_DAEMON_IP || '',
        NODE_PUBKEY: process.env.LIGHTNING_PUBKEY || '',
        COMMANDO_RUNE: process.env.COMMANDO_RUNE,
      };
      res.status(200).json(CONNECT_WALLET_SETTINGS);
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  }

  getFiatRate(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Getting Fiat Rate for: ' + req.params.fiatCurrency);
      const FIAT_VENUE = FIAT_VENUES.hasOwnProperty(req.params.fiatCurrency)
        ? FIAT_VENUES[req.params.fiatCurrency]
        : 'COINGECKO';
      return axios
        .get(FIAT_RATE_API + FIAT_VENUE + '/pairs/XBT/' + req.params.fiatCurrency)
        .then((response: any) => {
          logger.info('Fiat Response: ' + JSON.stringify(response.data));
          if (response.data.rate) {
            return res.status(200).json({ venue: FIAT_VENUE, rate: response.data.rate });
          } else {
            return handleError(new APIError('Price Not Found', 'Price Not Found'), req, res, next);
          }
        })
        .catch(err => {
          return handleError(err, req, res, next);
        });
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  }
}

export default new SharedController();
