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
  'setchannellabel',
  'listnodes',
  'sql',
  'listsqlschemas',
  'feerates',
  'fundchannel',
  'splicein',
  'spliceout',
  'close',
  'withdraw',
  'newaddr',
  'pay',
  'keysend',
  'invoice',
  'offer',
  'fetchinvoice',
  'decode',
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
  if (method === 'setchannellabel') {
    const p = params as any;
    if (
      !p ||
      Object.keys(p).some(k => !['channel_id', 'label'].includes(k)) ||
      typeof p.channel_id !== 'string' ||
      !/^[0-9a-f]{64}$/.test(p.channel_id) ||
      typeof p.label !== 'string' ||
      p.label.length > 80 ||
      /[\u0000-\u001f\u007f]/.test(p.label)
    ) {
      return 'Channel labels require a valid channel ID and at most 80 characters, without control characters';
    }
  }
  if (method === 'splicein' || method === 'spliceout') {
    const p = params as any;
    if (
      !p ||
      Array.isArray(p) ||
      Object.keys(p).some(k => !['channel', 'amount'].includes(k)) ||
      typeof p.channel !== 'string' ||
      !/^[0-9a-f]{64}$/.test(p.channel) ||
      typeof p.amount !== 'string' ||
      !/^[1-9][0-9]{0,15}$/.test(p.amount) ||
      !Number.isSafeInteger(Number(p.amount))
    ) {
      return 'Splicing requires one channel ID and a positive whole-satoshi amount; fee overrides and scripts are not accepted';
    }
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
      if (req.body.method === 'setchannellabel') {
        const { channel_id, label } = req.body.params;
        const channels = await this.clnService.call('listpeerchannels', {});
        if (!channels.channels?.some((c: any) => c.channel_id === channel_id)) {
          throw new APIError(
            HttpStatusCode.INVALID_DATA,
            'This channel is no longer available. Refresh the channel list.',
          );
        }
        await this.clnService.call('datastore', {
          key: ['cln-application', 'channel-labels', channel_id],
          string: label.trim(),
          mode: 'create-or-replace',
        });
        return res.status(200).json({ channel_id, label: label.trim() });
      }
      if (req.body.method === 'splicein' || req.body.method === 'spliceout') {
        if (APP_CONSTANTS.APP_CONNECT === AppConnect.GRPC) {
          throw new APIError(
            HttpStatusCode.INVALID_DATA,
            'Splicing requires a REST or Commando connection; this application’s gRPC schema does not expose splicein/spliceout.',
          );
        }
        const channels = await this.clnService.call('listpeerchannels', {});
        const channel = channels.channels.find(
          (c: any) => c.channel_id === req.body.params.channel,
        );
        if (
          !channel ||
          channel.state !== 'CHANNELD_NORMAL' ||
          !channel.peer_connected ||
          channel.inflight?.length
        ) {
          throw new APIError(
            HttpStatusCode.INVALID_DATA,
            'Splice requires a connected, active channel with no pending funding transaction. Inspect channel status before retrying.',
          );
        }
        const peers = await this.clnService.call('listpeers', { id: channel.peer_id });
        const features = peers.peers?.[0]?.features;
        if (
          typeof features !== 'string' ||
          !/^[0-9a-fA-F]+$/.test(features) ||
          !(BigInt('0x' + features) & (3n << 62n))
        ) {
          throw new APIError(
            HttpStatusCode.INVALID_DATA,
            'The peer has not negotiated splice support (feature 62/63). Enable splicing on the peer and reconnect.',
          );
        }
      }
      logger.info('Calling method: ' + req.body.method);
      return this.clnService
        .call(req.body.method, req.body.params)
        .then(async (commandRes: any) => {
          logger.info('Controller received response for ' + req.body.method);
          if (req.body.method === 'listpeerchannels') {
            try {
              const stored = await this.clnService.call('listdatastore', {
                key: ['cln-application', 'channel-labels'],
              });
              const labels = new Map(
                (stored.datastore || [])
                  .filter(
                    (v: any) =>
                      v.key?.length === 3 &&
                      v.key[0] === 'cln-application' &&
                      v.key[1] === 'channel-labels' &&
                      typeof v.string === 'string',
                  )
                  .map((v: any) => [v.key[2], v.string]),
              );
              commandRes.channels = commandRes.channels.map((c: any) => ({
                ...c,
                channel_label: labels.get(c.channel_id) || '',
              }));
            } catch (error) {
              commandRes.channels = commandRes.channels.map((c: any) => ({
                ...c,
                channel_label_error: 'Could not load channel labels: ' + String(error),
              }));
            }
            commandRes.channels = commandRes.channels.map((c: any) => ({
              ...c,
              splice_supported: APP_CONSTANTS.APP_CONNECT !== AppConnect.GRPC,
            }));
          }
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
