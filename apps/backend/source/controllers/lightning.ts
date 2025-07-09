import { Request, Response, NextFunction } from 'express';
import handleError from '../shared/error-handler.js';
import { LightningService } from '../service/lightning.service.js';
import { logger } from '../shared/logger.js';
import { AppConnect, APP_CONSTANTS } from '../shared/consts.js';

export class LightningController {
  private clnService: LightningService;

  constructor(clnService: LightningService) {
    this.clnService = clnService;
  }

  callMethod = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Calling method: ' + req.body.method);
      this.clnService
        .call(req.body.method, req.body.params)
        .then((commandRes: any) => {
          logger.info(
            'Controller received response for ' +
              req.body.method +
              ': ' +
              JSON.stringify(commandRes),
          );
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
              JSON.stringify(err),
          );
          return handleError(err, req, res, next);
        });
    } catch (error: any) {
      return handleError(error, req, res, next);
    }
  };
}
