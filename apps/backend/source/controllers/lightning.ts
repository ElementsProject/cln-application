import { Request, Response, NextFunction } from 'express';
import handleError from '../shared/error-handler.js';
import { LightningService } from '../service/lightning.service.js';
import { logger } from '../shared/logger.js';
import { AppConnect, APP_CONSTANTS, HttpStatusCode } from '../shared/consts.js';
import { APIError } from '../models/errors.js';

const ALLOWED_METHODS = new Set([
  'getinfo',
  'listfunds',
  'listpeers',
  'listpeerchannels',
  'listnodes',
  'sql',
  'listsqlschemas',
  'feerates',
  'fundchannel',
  'close',
  'withdraw',
  'newaddr',
  'pay',
  'keysend',
  'invoice',
  'offer',
  'decode',
  'fetchinvoice',
  'createrune',
]);

const CREATERUNE_ALTERNATIVE = /^method=(invoice|listinvoices)$/;

export function validateCallRequest(method: unknown, params: unknown): string | null {
  if (typeof method !== 'string' || !ALLOWED_METHODS.has(method)) {
    return 'Method not permitted: ' + String(method);
  }
  if (params !== undefined && (typeof params !== 'object' || params === null)) {
    return 'Invalid params for ' + method;
  }
  if (method === 'createrune') {
    const restrictions = (params as any)?.restrictions;
    const valid =
      Array.isArray(restrictions) &&
      restrictions.length > 0 &&
      restrictions.every(
        (alternatives: unknown) =>
          Array.isArray(alternatives) &&
          alternatives.length > 0 &&
          alternatives.every(
            (alt: unknown) => typeof alt === 'string' && CREATERUNE_ALTERNATIVE.test(alt),
          ),
      );
    if (!valid) {
      return 'createrune is limited to invoice restrictions';
    }
  }
  return null;
}

export class LightningController {
  private clnService: LightningService;

  constructor(clnService: LightningService) {
    this.clnService = clnService;
  }

  callMethod = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validationError = validateCallRequest(req.body?.method, req.body?.params);
      if (validationError) {
        logger.warn('Refused lightning call: ' + validationError);
        return handleError(new APIError(HttpStatusCode.FORBIDDEN, validationError), req, res, next);
      }
      logger.info('Calling method: ' + req.body.method);
      this.clnService
        .call(req.body.method, req.body.params)
        .then((commandRes: any) => {
          logger.info('Controller received response for ' + req.body.method);
          if (
            APP_CONSTANTS.APP_CONNECT == AppConnect.COMMANDO &&
            req.body.method &&
            req.body.method === 'listpeers'
          ) {
            // Filter out ln message pubkey from peers list
            const lnmPubkey = this.clnService.getLNMsgPubkey();
            commandRes.peers = commandRes.peers.filter((peer: any) => peer.id !== lnmPubkey);
            res.status(200).json(commandRes);
          } else {
            res.status(200).json(commandRes);
          }
        })
        .catch((err: any) => {
          logger.error(
            'Controller caught lightning error from ' +
              req.body.method +
              ': ' +
              (err?.message || err),
          );
          return handleError(err, req, res, next);
        });
    } catch (error: any) {
      return handleError(error, req, res, next);
    }
  };
}
