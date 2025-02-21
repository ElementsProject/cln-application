import { Request, Response, NextFunction } from 'express';
import handleError from '../shared/error-handler.js';
import { CLNService, LightningService } from '../service/lightning.service.js';
import { logger } from '../shared/logger.js';
import { APP_CONSTANTS } from '../shared/consts.js';

const clnService: LightningService = CLNService;

class LightningController {
  callMethod(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Calling method: ' + req.body.method);
      clnService
        .call(req.body.method, req.body.params)
        .then((commandRes: any) => {
          logger.info(
            'Controller received response for ' +
              req.body.method +
              ': ' +
              JSON.stringify(commandRes),
          );
          if (req.body.method && req.body.method === 'listpeers') {
            // Filter out ln message pubkey from peers list
            const lnmPubkey = clnService.getLNMsgPubkey();
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
  }
}

export default new LightningController();
