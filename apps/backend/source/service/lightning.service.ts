import * as crypto from 'crypto';
import https from 'https';
import axios, { AxiosHeaders } from 'axios';
import Lnmessage from 'lnmessage';
import WebSocket from 'ws';
import { GRPCError, LightningError, ValidationError } from '../models/errors.js';
import {
  HttpStatusCode,
  APP_CONSTANTS,
  AppConnect,
  Environment,
  LN_MESSAGE_CONFIG,
  REST_CONFIG,
} from '../shared/consts.js';
import { logger } from '../shared/logger.js';
import { setEnvVariables, validateEnvVariables } from '../shared/utils.js';
import { NodeProfile } from '../models/node-profile.type.js';

/** Internal flag to skip env-based init in the constructor */
const SKIP_INIT = Symbol('skipInit');

export class LightningService {
  private clnService: any = null;
  private axiosConfig: any = {
    baseURL: '',
    headers: {},
    httpsAgent: null,
  };
  /** Per-instance rune. Defaults to APP_CONSTANTS.ADMIN_RUNE for legacy path. */
  private rune: string = '';

  constructor(skipInit?: typeof SKIP_INIT) {
    if (skipInit === SKIP_INIT) {
      // Factory-created instance: skip env setup
      return;
    }
    try {
      setEnvVariables();
      validateEnvVariables();
    } catch (error: any) {
      throw new ValidationError(HttpStatusCode.INVALID_DATA, error);
    }
    this.rune = APP_CONSTANTS.ADMIN_RUNE;
    try {
      logger.info('Strating Lightning Service with APP_CONNECT: ' + APP_CONSTANTS.APP_CONNECT);
      switch (APP_CONSTANTS.APP_CONNECT) {
        case AppConnect.REST:
          logger.info('REST connecting with config: ' + JSON.stringify(REST_CONFIG));
          const headers = new AxiosHeaders();
          headers.set('rune', REST_CONFIG.rune);
          this.axiosConfig = {
            baseURL: REST_CONFIG.url + '/v1/',
            headers,
          };
          if (APP_CONSTANTS.LIGHTNING_REST_PROTOCOL === 'https') {
            this.axiosConfig.httpsAgent = new https.Agent({ ca: REST_CONFIG.restCaCert });
          }
          break;
        case AppConnect.GRPC:
          this.clnService = null;
          throw new ValidationError(
            HttpStatusCode.INVALID_DATA,
            'gRPC connection to the Lightning node is not supported. Please use the COMMANDO or REST options for APP_CONNECT.',
          );
          // logger.info('GRPC connecting with config: ' + JSON.stringify(GRPC_CONFIG));
          // this.clnService = new GRPCService(GRPC_CONFIG);
          break;
        default:
          logger.info('lnMessage connecting with config: ' + JSON.stringify(LN_MESSAGE_CONFIG));
          this.clnService = new Lnmessage(LN_MESSAGE_CONFIG);
          this.clnService.connect();
          break;
      }
    } catch (error: any) {
      logger.error('Failed to construct lightning service: ' + JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Create a LightningService from a NodeProfile without mutating globals.
   */
  static createFromProfile(profile: NodeProfile): LightningService {
    const wsProtocol = APP_CONSTANTS.LIGHTNING_WS_PROTOCOL || 'ws';
    const config: any = {
      remoteNodePublicKey: profile.pubkey,
      wsProxy: wsProtocol + '://' + profile.wsHost + ':' + profile.wsPort,
      ip: profile.wsHost,
      port: profile.wsPort,
      privateKey: crypto.randomBytes(32).toString('hex'),
      socket: (url: string) =>
        wsProtocol === 'wss'
          ? new WebSocket(url, { rejectUnauthorized: false })
          : new WebSocket(url),
      logger: {
        info: APP_CONSTANTS.APP_MODE === Environment.PRODUCTION ? () => {} : console.info,
        warn: APP_CONSTANTS.APP_MODE === Environment.PRODUCTION ? () => {} : console.warn,
        error: console.error,
      },
    };

    const svc = new LightningService(SKIP_INIT);
    svc.clnService = new Lnmessage(config);
    svc.clnService.connect();
    svc.rune = profile.rune;
    logger.info(
      'Created LightningService from profile: ' + profile.id + ' (' + profile.label + ')',
    );
    return svc;
  }

  /**
   * Probe a node profile: create temp connection, call getinfo, disconnect, return info.
   */
  static async probe(profile: NodeProfile): Promise<{
    alias: string;
    pubkey: string;
    network: string;
    blockheight: number;
    version: string;
  }> {
    const svc = LightningService.createFromProfile(profile);
    try {
      // Wait a moment for the connection to establish
      await new Promise(resolve => setTimeout(resolve, 1000));
      const info: any = await svc.call('getinfo', []);
      return {
        alias: info.alias || '',
        pubkey: info.id || profile.pubkey,
        network: info.network || '',
        blockheight: info.blockheight || 0,
        version: info.version || '',
      };
    } finally {
      svc.disconnect();
    }
  }

  /**
   * Tear down the lnmessage connection.
   */
  disconnect(): void {
    try {
      if (this.clnService && typeof this.clnService.disconnect === 'function') {
        this.clnService.disconnect();
        logger.info('LightningService disconnected');
      }
    } catch (error: any) {
      logger.error('Error disconnecting LightningService: ' + (error.message || error));
    }
    this.clnService = null;
  }

  getLNMsgPubkey = () => {
    return this.clnService?.publicKey || '';
  };

  call = async (method: string, methodParams: any[]) => {
    switch (APP_CONSTANTS.APP_CONNECT) {
      case AppConnect.REST:
        return axios
          .post(method, methodParams, this.axiosConfig)
          .then((commandRes: any) => {
            logger.info(
              'REST response for ' +
                method +
                ': ' +
                JSON.stringify(commandRes.data || commandRes.rows),
            );
            return Promise.resolve(commandRes.data || commandRes.rows);
          })
          .catch((err: any) => {
            logger.error('REST lightning error from ' + method + ' command');
            if (typeof err === 'string') {
              logger.error(err);
              throw new LightningError(HttpStatusCode.LIGHTNING_SERVER, err);
            } else {
              logger.error(JSON.stringify(err));
              throw new LightningError(HttpStatusCode.LIGHTNING_SERVER, err.message || err.code);
            }
          });
      case AppConnect.GRPC:
        return this.clnService
          .callMethod(method, methodParams)
          .then((gRPCRes: any) => {
            logger.info('gRPC response for ' + method + ': ' + JSON.stringify(gRPCRes));
            return Promise.resolve(gRPCRes);
          })
          .catch((err: GRPCError) => {
            logger.error('gRPC lightning error from ' + method + ' command');
            throw err;
          });
      default:
        return this.clnService
          .commando({
            method: method,
            params: methodParams,
            rune: this.rune || APP_CONSTANTS.ADMIN_RUNE,
            reqId: crypto.randomBytes(8).toString('hex'),
            reqIdPrefix: 'clnapp',
          })
          .then((commandRes: any) => {
            logger.info('Commando response for ' + method + ': ' + JSON.stringify(commandRes));
            return Promise.resolve(commandRes);
          })
          .catch((err: any) => {
            logger.error('Commando lightning error from ' + method + ' command');
            if (typeof err === 'string') {
              logger.error(err);
              throw new LightningError(HttpStatusCode.LIGHTNING_SERVER, err);
            } else {
              logger.error(JSON.stringify(err));
              throw new LightningError(HttpStatusCode.LIGHTNING_SERVER, err.message || err.code);
            }
          });
    }
  };
}
