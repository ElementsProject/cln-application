import axios from 'axios';
import * as fs from 'fs';
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
import { addServerConfig, refreshEnvVariables } from '../shared/utils.js';
import { CLNService } from '../service/lightning.service.js';
import { ShowRunes } from '../models/showrunes.type.js';

class SharedController {
  getApplicationSettings(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Getting Application Settings from ' + APP_CONSTANTS.APP_CONFIG_FILE);
      if (!fs.existsSync(APP_CONSTANTS.APP_CONFIG_FILE)) {
        fs.writeFileSync(
          APP_CONSTANTS.APP_CONFIG_FILE,
          JSON.stringify(DEFAULT_CONFIG, null, 2),
          'utf-8',
        );
      }
      let config = {
        uiConfig: JSON.parse(fs.readFileSync(APP_CONSTANTS.APP_CONFIG_FILE, 'utf-8')),
      };
      delete config.uiConfig.password;
      delete config.uiConfig.isLoading;
      delete config.uiConfig.error;
      delete config.uiConfig.singleSignOn;
      config = addServerConfig(config);
      res.status(200).json(config);
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  }

  setApplicationSettings(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Updating Application Settings: ' + JSON.stringify(req.body));
      const config = JSON.parse(fs.readFileSync(APP_CONSTANTS.APP_CONFIG_FILE, 'utf-8'));
      req.body.uiConfig.password = config.password; // Before saving, add password in the config received from frontend
      fs.writeFileSync(
        APP_CONSTANTS.APP_CONFIG_FILE,
        JSON.stringify(req.body.uiConfig, null, 2),
        'utf-8',
      );
      res.status(201).json({ message: 'Application Settings Updated Successfully' });
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  }

  getWalletConnectSettings(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Getting Connection Settings');
      refreshEnvVariables();
      res.status(200).json(APP_CONSTANTS);
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
      if (invoiceRune && fs.existsSync(APP_CONSTANTS.COMMANDO_CONFIG)) {
        const invoiceRuneString = `INVOICE_RUNE="${invoiceRune.rune}"\n`;
        fs.appendFileSync(APP_CONSTANTS.COMMANDO_CONFIG, invoiceRuneString, 'utf-8');
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
