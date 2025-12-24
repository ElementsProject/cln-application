import * as crypto from 'crypto';
import https from 'https';
import axios, { AxiosHeaders } from 'axios';
import Lnmessage from 'lnmessage';
import { GRPCError, LightningError, ValidationError } from '../models/errors.js';
import {
  HttpStatusCode,
  APP_CONSTANTS,
  AppConnect,
  LN_MESSAGE_CONFIG,
  REST_CONFIG
} from '../shared/consts.js';
import { logger } from '../shared/logger.js';
import { setEnvVariables, validateEnvVariables } from '../shared/utils.js';

export class LightningService {
  private clnService: any = null;
  private axiosConfig: any = {
    baseURL: '',
    headers: {},
    httpsAgent: null,
  };

  constructor() {
    try {
      setEnvVariables();
      validateEnvVariables();
    } catch (error: any) {
      throw new ValidationError(HttpStatusCode.INVALID_DATA, error);
    }
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
          throw new ValidationError(HttpStatusCode.INVALID_DATA, 'gRPC connection to the Lightning node is not supported. Please use the COMMANDO or REST options for APP_CONNECT.');
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

  getLNMsgPubkey = () => {
    return this.clnService.publicKey;
  };

  call = async (method: string, methodParams: any[]) => {
    switch (APP_CONSTANTS.APP_CONNECT) {
      case AppConnect.REST:
        return axios
          .post(method, methodParams, this.axiosConfig)
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
            rune: APP_CONSTANTS.ADMIN_RUNE,
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
