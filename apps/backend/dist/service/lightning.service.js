import * as fs from 'fs';
import * as crypto from 'crypto';
import Lnmessage from 'lnmessage';
import { LightningError } from '../models/errors.js';
import { HttpStatusCode, APP_CONSTANTS, LN_MESSAGE_CONFIG } from '../shared/consts.js';
import { logger } from '../shared/logger.js';
import { readFileSync } from 'fs';
export class LightningService {
    clnService = null;
    constructor() {
        try {
            logger.info('Getting Commando Rune');
            if (fs.existsSync(APP_CONSTANTS.COMMANDO_ENV_LOCATION)) {
                this.refreshEnvVariables();
                logger.info('lnMessage connecting with config: ' + JSON.stringify(LN_MESSAGE_CONFIG));
                this.clnService = new Lnmessage(LN_MESSAGE_CONFIG);
                this.clnService.connect();
            }
        }
        catch (error) {
            logger.error('Failed to read rune for Commando connection: ' + JSON.stringify(error));
            throw error;
        }
    }
    getLNMsgPubkey = () => {
        return this.clnService.publicKey;
    };
    call = async (method, methodParams) => {
        return this.clnService
            .commando({
            method: method,
            params: methodParams,
            rune: APP_CONSTANTS.COMMANDO_RUNE,
            reqId: crypto.randomBytes(8).toString('hex'),
            reqIdPrefix: 'clnapp',
        })
            .then((commandRes) => {
            logger.info('Commando response for ' + method + ': ' + JSON.stringify(commandRes));
            return Promise.resolve(commandRes);
        })
            .catch((err) => {
            logger.error('Commando lightning error from ' + method + ' command');
            if (typeof err === 'string') {
                logger.error(err);
                throw new LightningError(HttpStatusCode.LIGHTNING_SERVER, err);
            }
            else {
                logger.error(JSON.stringify(err));
                throw new LightningError(HttpStatusCode.LIGHTNING_SERVER, err.message || err.code);
            }
        });
    };
    refreshEnvVariables() {
        const envVars = this.parseEnvFile(APP_CONSTANTS.COMMANDO_ENV_LOCATION);
        process.env.LIGHTNING_PUBKEY = envVars.LIGHTNING_PUBKEY;
        process.env.COMMANDO_RUNE = envVars.LIGHTNING_RUNE;
        process.env.INVOICE_RUNE = envVars.INVOICE_RUNE !== undefined ? envVars.INVOICE_RUNE : '';
        APP_CONSTANTS.COMMANDO_RUNE = process.env.COMMANDO_RUNE;
        LN_MESSAGE_CONFIG.remoteNodePublicKey = process.env.LIGHTNING_PUBKEY;
    }
    parseEnvFile(filePath) {
        try {
            const content = readFileSync(filePath, 'utf8');
            const lines = content.split('\n');
            const envVars = {};
            for (let line of lines) {
                line = line.trim();
                if (line && line.indexOf('=') !== -1 && !line.startsWith('#')) {
                    const [key, ...value] = line.split('=');
                    envVars[key] = value.join('=').replace(/(^"|"$)/g, '');
                }
            }
            return envVars;
        }
        catch (err) {
            logger.error('Error reading .commando-env file:', err);
            return {};
        }
    }
}
export const CLNService = new LightningService();
