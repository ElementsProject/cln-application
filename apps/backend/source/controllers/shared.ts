import axios from 'axios';
import * as fs from 'fs';
import { Request, Response, NextFunction } from 'express';

import {
  APP_CONSTANTS,
  DEFAULT_CONFIG,
  FIAT_CURRENCIES,
  FIAT_RATE_API,
  FIAT_RATE_CACHE_MS,
  HttpStatusCode,
  UI_APP_MODES,
  UI_UNITS,
} from '../shared/consts.js';
import { logger } from '../shared/logger.js';
import handleError from '../shared/error-handler.js';
import { APIError } from '../models/errors.js';
import { addServerConfig, setEnvVariables } from '../shared/utils.js';
import { Rune, ShowRunes } from '../models/showrunes.type.js';
import { LightningService } from '../service/lightning.service.js';

export function validateUiConfig(uiConfig: any): string | null {
  if (!uiConfig || typeof uiConfig !== 'object' || Array.isArray(uiConfig)) {
    return 'uiConfig object is required';
  }
  if (!UI_UNITS.includes(uiConfig.unit)) {
    return 'Invalid unit, expected one of ' + UI_UNITS.join(', ');
  }
  if (!FIAT_CURRENCIES.includes(uiConfig.fiatUnit)) {
    return 'Invalid fiatUnit, expected one of ' + FIAT_CURRENCIES.join(', ');
  }
  if (!UI_APP_MODES.includes(uiConfig.appMode)) {
    return 'Invalid appMode, expected one of ' + UI_APP_MODES.join(', ');
  }
  return null;
}

const INVOICE_RUNE_METHODS = ['invoice', 'listinvoices'];

// A rune qualifies as the invoice rune only when every restriction on the
// method field is an equality on invoice or listinvoices, both methods are
// named, and the node has not blacklisted it. Matching on the value alone
// would also accept "method/invoice" (any method except invoice).
export function isInvoiceOnlyRune(rune: Rune): boolean {
  if (rune.blacklisted) return false;
  const methodAlternatives = rune.restrictions
    .flatMap(restriction => restriction.alternatives)
    .filter(alternative => alternative.fieldname === 'method');
  if (methodAlternatives.length === 0) return false;
  const allEquality = methodAlternatives.every(
    alternative =>
      alternative.condition === '=' && INVOICE_RUNE_METHODS.includes(alternative.value),
  );
  const named = methodAlternatives.map(alternative => alternative.value);
  return allEquality && INVOICE_RUNE_METHODS.every(method => named.includes(method));
}

// Last rate fetched per currency, reused for FIAT_RATE_CACHE_MS
const fiatRateCache = new Map<string, { rate: number; fetchedAt: number }>();

export class SharedController {
  private clnService: LightningService;

  constructor(clnService: LightningService) {
    this.clnService = clnService;
  }

  getApplicationSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Getting Application Settings from ' + APP_CONSTANTS.APP_CONFIG_FILE);
      if (!fs.existsSync(APP_CONSTANTS.APP_CONFIG_FILE)) {
        logger.warn(
          `Config file ${APP_CONSTANTS.APP_CONFIG_FILE} not found. Creating default config.`,
        );
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
  };

  setApplicationSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uiConfig = req.body?.uiConfig;
      logger.info('Updating Application Settings: ' + Object.keys(uiConfig || {}).join(', '));
      const validationError = validateUiConfig(uiConfig);
      if (validationError) {
        return handleError(
          new APIError(HttpStatusCode.BAD_REQUEST, validationError),
          req,
          res,
          next,
        );
      }
      const config = JSON.parse(fs.readFileSync(APP_CONSTANTS.APP_CONFIG_FILE, 'utf-8'));
      const updatedConfig = {
        unit: uiConfig.unit,
        fiatUnit: uiConfig.fiatUnit,
        appMode: uiConfig.appMode,
        password: config.password,
      };
      fs.writeFileSync(
        APP_CONSTANTS.APP_CONFIG_FILE,
        JSON.stringify(updatedConfig, null, 2),
        'utf-8',
      );
      res.status(201).json({ message: 'Application Settings Updated Successfully' });
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  };

  getWalletConnectSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Getting Connection Settings');
      setEnvVariables();
      res.status(200).json(APP_CONSTANTS);
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  };

  getFiatRate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fiatCurrency = String(req.params.fiatCurrency);
      if (!FIAT_CURRENCIES.includes(fiatCurrency)) {
        return handleError(
          new APIError(HttpStatusCode.BAD_REQUEST, 'Unsupported fiat currency'),
          req,
          res,
          next,
        );
      }
      const cached = fiatRateCache.get(fiatCurrency);
      if (cached && Date.now() - cached.fetchedAt < FIAT_RATE_CACHE_MS) {
        return res.status(200).json({ rate: cached.rate });
      }
      logger.info('Getting Fiat Rate for: ' + fiatCurrency);
      const response = await axios.get(FIAT_RATE_API + encodeURIComponent(fiatCurrency));
      const rate = response.data?.bitcoin?.[fiatCurrency.toLowerCase()];
      if (typeof rate !== 'number') {
        return handleError(
          new APIError(HttpStatusCode.NOT_FOUND, 'Price value not found'),
          req,
          res,
          next,
        );
      }
      fiatRateCache.set(fiatCurrency, { rate, fetchedAt: Date.now() });
      return res.status(200).json({ rate });
    } catch (error: any) {
      logger.error('Error from Fiat Rate: ' + (error?.message || error));
      res.status(200).json({ rate: 0 });
    }
  };

  saveInvoiceRune = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Saving Invoice Rune');
      setEnvVariables();
      if (APP_CONSTANTS.INVOICE_RUNE !== '') {
        throw new APIError(HttpStatusCode.CONFLICT, 'Invoice rune already exists');
      }
      const showRunes: ShowRunes = await this.clnService.call('showrunes', {});
      const invoiceRune = showRunes.runes.find(isInvoiceOnlyRune);
      if (invoiceRune && fs.existsSync(APP_CONSTANTS.LIGHTNING_VARS_FILE)) {
        const invoiceRuneString = `INVOICE_RUNE="${invoiceRune.rune}"\n`;
        fs.appendFileSync(APP_CONSTANTS.LIGHTNING_VARS_FILE, invoiceRuneString, 'utf-8');
        res.status(201).send();
      } else {
        throw new APIError(
          HttpStatusCode.NOT_FOUND,
          'Invoice rune not found or the commando env file does not exist.',
        );
      }
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  };
}
