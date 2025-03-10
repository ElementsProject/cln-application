import * as fs from 'fs';
import * as crypto from 'crypto';
import { join } from 'path';
import https from 'https';
import axios, { AxiosHeaders } from 'axios';
import Lnmessage from 'lnmessage';
import { GRPCError, LightningError } from '../models/errors.js';
import { GRPCService } from './grpc.service.js';
import {
  HttpStatusCode,
  APP_CONSTANTS,
  AppConnect,
  LN_MESSAGE_CONFIG,
  REST_CONFIG,
  GRPC_CONFIG,
} from '../shared/consts.js';
import { logger } from '../shared/logger.js';
import { refreshEnvVariables } from '../shared/utils.js';

export class LightningService {
  private clnService: any = null;

  constructor() {
    try {
      logger.info('Getting Commando Rune');
      if (fs.existsSync(APP_CONSTANTS.COMMANDO_CONFIG)) {
        refreshEnvVariables();
        switch (APP_CONSTANTS.APP_CONNECT) {
          case AppConnect.REST:
            logger.info('REST connecting with config: ' + JSON.stringify(REST_CONFIG));
            break;
          case AppConnect.GRPC:
            logger.info('GRPC connecting with config: ' + JSON.stringify(GRPC_CONFIG));
            this.clnService = new GRPCService(GRPC_CONFIG);
            break;
          default:
            logger.info('lnMessage connecting with config: ' + JSON.stringify(LN_MESSAGE_CONFIG));
            this.clnService = new Lnmessage(LN_MESSAGE_CONFIG);
            this.clnService.connect();
            break;
        }
      }
    } catch (error: any) {
      logger.error('Failed to read rune for Commando connection: ' + JSON.stringify(error));
      throw error;
    }
  }

  getLNMsgPubkey = () => {
    return this.clnService.publicKey;
  };

  call = async (method: string, methodParams: any[]) => {
    switch (APP_CONSTANTS.APP_CONNECT) {
      case AppConnect.REST:
        const headers = new AxiosHeaders();
        headers.set('rune', APP_CONSTANTS.COMMANDO_RUNE);
        let axiosConfig: any = {
          baseURL: REST_CONFIG.url + '/v1/',
          headers,
        };
        if (APP_CONSTANTS.LIGHTNING_REST_PROTOCOL === 'https') {
          const caCert = fs.readFileSync(join(APP_CONSTANTS.LIGHTNING_CERTS_PATH || '.', 'ca.pem'));
          const httpsAgent = new https.Agent({
            ca: caCert,
          });
          axiosConfig.httpsAgent = httpsAgent;
        }
        return axios
          .post(method, methodParams, axiosConfig)
          .then((commandRes: any) => {
            logger.info('REST response for ' + method + ': ' + JSON.stringify(commandRes.data));
            return Promise.resolve(commandRes.data);
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
            rune: APP_CONSTANTS.COMMANDO_RUNE,
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

export const CLNService = new LightningService();
