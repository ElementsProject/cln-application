import axios from 'axios';
import * as fs from 'fs';
import { join } from 'path';
import { Request, Response, NextFunction } from 'express';
import {
  APP_CONSTANTS,
  DEFAULT_CONFIG,
  FIAT_RATE_API,
  FIAT_VENUES,
  HttpStatusCode,
} from '../shared/consts.js';
import { logger } from '../shared/logger.js';
import handleError from '../shared/error-handler.js';
import { APIError } from '../models/errors.js';
import { setSharedApplicationConfig, overrideSettingsWithEnvVariables } from '../shared/utils.js';
import { sep } from 'path';
import { CLNService } from '../service/lightning.service.js';
import { ShowRunes } from '../models/showrunes.type.js';

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
      let config = JSON.parse(fs.readFileSync(APP_CONSTANTS.CONFIG_LOCATION, 'utf-8'));
      config = overrideSettingsWithEnvVariables(config);
      setSharedApplicationConfig(config);
      delete config.password;
      res.status(200).json(config);
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  }

  setApplicationSettings(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Updating Application Settings: ' + JSON.stringify(req.body));
      const config = JSON.parse(fs.readFileSync(APP_CONSTANTS.CONFIG_LOCATION, 'utf-8'));
      req.body.password = config.password; // Before saving, add password in the config received from frontend
      fs.writeFileSync(APP_CONSTANTS.CONFIG_LOCATION, JSON.stringify(req.body, null, 2), 'utf-8');
      res.status(201).json({ message: 'Application Settings Updated Successfully' });
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  }

  getWalletConnectSettings(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Getting Connection Settings');
      const CERTS_PATH =
        process.env.CORE_LIGHTNING_PATH + sep + process.env.APP_BITCOIN_NETWORK + sep;
      let macaroon = '';
      let clientKey = '';
      let clientCert = '';
      let caCert = '';
      let packageData = '{ version: "0.0.4" }';
      if (fs.existsSync(APP_CONSTANTS.MACAROON_PATH)) {
        logger.info(
          'Getting REST Access Macaroon from ' + process.env.APP_CORE_LIGHTNING_REST_CERT_DIR,
        );
        macaroon = Buffer.from(fs.readFileSync(APP_CONSTANTS.MACAROON_PATH)).toString('hex');
      }
      if (fs.existsSync('package.json')) {
        packageData = Buffer.from(fs.readFileSync('package.json')).toString();
      }
      if (fs.existsSync(CERTS_PATH + 'client-key.pem')) {
        clientKey = fs.readFileSync(CERTS_PATH + 'client-key.pem').toString();
        clientKey = clientKey
          .replace(/(\r\n|\n|\r)/gm, '')
          .replace('-----BEGIN PRIVATE KEY-----', '')
          .replace('-----END PRIVATE KEY-----', '');
      }
      if (fs.existsSync(CERTS_PATH + 'client.pem')) {
        clientCert = fs.readFileSync(CERTS_PATH + 'client.pem').toString();
        clientCert = clientCert
          .replace(/(\r\n|\n|\r)/gm, '')
          .replace('-----BEGIN CERTIFICATE-----', '')
          .replace('-----END CERTIFICATE-----', '');
      }
      if (fs.existsSync(CERTS_PATH + 'ca.pem')) {
        caCert = fs.readFileSync(CERTS_PATH + 'ca.pem').toString();
        caCert = caCert
          .replace(/(\r\n|\n|\r)/gm, '')
          .replace('-----BEGIN CERTIFICATE-----', '')
          .replace('-----END CERTIFICATE-----', '');
      }
      CLNService.refreshEnvVariables();
      const CONNECT_WALLET_SETTINGS = {
        LOCAL_HOST: process.env.LOCAL_HOST || '',
        DEVICE_DOMAIN_NAME: process.env.DEVICE_DOMAIN_NAME || '',
        TOR_HOST: process.env.APP_CORE_LIGHTNING_REST_HIDDEN_SERVICE || '',
        WS_PORT: process.env.APP_CORE_LIGHTNING_WEBSOCKET_PORT || '',
        GRPC_PORT: process.env.APP_CORE_LIGHTNING_DAEMON_GRPC_PORT || '',
        CLIENT_KEY: clientKey,
        CLIENT_CERT: clientCert,
        CA_CERT: caCert,
        REST_PORT: process.env.APP_CORE_LIGHTNING_REST_PORT || '',
        REST_MACAROON: macaroon,
        CLN_NODE_IP: process.env.APP_CORE_LIGHTNING_DAEMON_IP || '',
        NODE_PUBKEY: process.env.LIGHTNING_PUBKEY || '',
        COMMANDO_RUNE: process.env.COMMANDO_RUNE,
        APP_VERSION: JSON.parse(packageData).version || '',
        INVOICE_RUNE: process.env.INVOICE_RUNE || '',
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
          logger.info('Fiat Response: ' + JSON.stringify(response?.data));
          if (response.data?.rate) {
            return res.status(200).json({ venue: FIAT_VENUE, rate: response.data?.rate });
          } else {
            return handleError(
              new APIError(HttpStatusCode.NOT_FOUND, 'Price Not Found'),
              req,
              res,
              next,
            );
          }
        })
        .catch(err => {
          return handleError(err, req, res, next);
        });
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  }

  async saveInvoiceRune(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Saving Invoice Rune');
      const showRunes: ShowRunes = await CLNService.call('showrunes', []);
      const invoiceRune = showRunes.runes.find(
        rune =>
          rune.restrictions.some(restriction =>
            restriction.alternatives.some(alternative => alternative.value === 'invoice'),
          ) &&
          rune.restrictions.some(restriction =>
            restriction.alternatives.some(alternative => alternative.value === 'listinvoices'),
          ),
      );
      if (invoiceRune && fs.existsSync(APP_CONSTANTS.COMMANDO_ENV_LOCATION)) {
        const invoiceRuneString = `INVOICE_RUNE="${invoiceRune.rune}"\n`;
        fs.appendFileSync(APP_CONSTANTS.COMMANDO_ENV_LOCATION, invoiceRuneString, 'utf-8');
        res.status(201).send();
      } else {
        throw new Error('Invoice rune not found or .commando-env does not exist.');
      }
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  }
}

export default new SharedController();
