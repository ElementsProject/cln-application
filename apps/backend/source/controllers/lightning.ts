import { Request, Response, NextFunction } from 'express';
import handleError from '../shared/error-handler.js';
import { LNMessage, LightningService } from '../service/lightning.service.js';
import { logger } from '../shared/logger.js';
import { LightningError } from '../models/errors.js';
import { HttpStatusCode } from '../shared/consts.js';

const lnMessage: LightningService = LNMessage;

export const getNodesInfo = (lightningPeers: any) => {
  return Promise.all(
    lightningPeers.peers.map((peer: any) => {
      return new Promise((resolve, reject) => {
        lnMessage
          .call('listnodes', [peer.id])
          .then(data => {
            peer.alias = data.nodes[0].alias || peer.id.substring(0, 20);
            resolve(peer);
          })
          .catch(err => {
            peer.alias = peer.id.substring(0, 20);
            resolve(peer);
          });
      });
    }),
  )
    .then(peersWithAliases => {
      logger.info('Peers with Aliases: ' + JSON.stringify(peersWithAliases));
      return { peers: peersWithAliases };
    })
    .catch(err => {
      logger.error('Controller caught lightning error from list nodes: ' + JSON.stringify(err));
      throw new LightningError(
        'Controller caught lightning error from list nodes: ' + JSON.stringify(err),
        err,
        HttpStatusCode.LIGHTNING_SERVER,
        'Get Network Nodes Information',
      );
    });
};

class LightningController {
  callMethod(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Calling method: ' + req.body.method);
      lnMessage
        .call(req.body.method, req.body.params)
        .then((commandRes: any) => {
          logger.info(
            'Controller received response for ' +
              req.body.method +
              ': ' +
              JSON.stringify(commandRes),
          );
          if (req.body.method && req.body.method === 'listpeers') {
            try {
              // Filter out ln message pubkey from peers list
              const lnmPubkey = lnMessage.getLNMsgPubkey();
              commandRes.peers = commandRes.peers.filter((peer: any) => peer.id !== lnmPubkey);
              // To get node aliases from liseNodes
              getNodesInfo(commandRes).then((resWithAliases: any) => {
                logger.info(resWithAliases);
                res.status(200).json(resWithAliases);
              });
            } catch (error: any) {
              logger.error('Lightning error from Get Nodes Info : ' + JSON.stringify(error));
              return handleError(error, req, res, next);
            }
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
