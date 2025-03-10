import axios, { AxiosHeaders } from 'axios';
import * as path from 'path';
import fs from 'fs';
import https from 'https';
import protobuf from 'protobufjs';
import { HttpStatusCode, GRPC_CONFIG, APP_CONSTANTS } from '../shared/consts.js';
import { GRPCError } from '../models/errors.js';
import { logger } from '../shared/logger.js';
export class GRPCService {
    authPubkey;
    authSignature;
    protoPath;
    clnNode;
    axiosConfig;
    constructor(grpcConfig) {
        this.authSignature = 'A'.repeat(64);
        this.authPubkey = Buffer.from(grpcConfig.pubkey, 'hex').toString('base64');
        this.protoPath = [
            path.resolve(process.cwd(), './proto/node.proto'),
            path.resolve(process.cwd(), './proto/primitives.proto'),
        ];
        this.clnNode = protobuf.Root.fromJSON(protobuf.loadSync(this.protoPath).toJSON());
        const headers = new AxiosHeaders();
        headers.set('content-type', 'application/grpc');
        headers.set('accept', 'application/grpc');
        headers.set('glauthpubkey', this.authPubkey);
        headers.set('glauthsig', this.authSignature);
        this.axiosConfig = {
            responseType: 'arraybuffer',
            baseURL: `${grpcConfig.url}/cln.Node/`,
            headers,
        };
        if (APP_CONSTANTS.LIGHTNING_GRPC_PROTOCOL === 'https') {
            const httpsAgent = new https.Agent({
                cert: fs.readFileSync(path.join(APP_CONSTANTS.LIGHTNING_CERTS_PATH || '.', 'client.pem')),
                key: fs.readFileSync(path.join(APP_CONSTANTS.LIGHTNING_CERTS_PATH || '.', 'client-key.pem')),
                ca: fs.readFileSync(path.join(APP_CONSTANTS.LIGHTNING_CERTS_PATH || '.', 'ca.pem')),
            });
            this.axiosConfig.httpsAgent = httpsAgent;
        }
    }
    static getGrpcStatusMessages(method) {
        return {
            0: `${method} completed successfully.`,
            1: `${method} was cancelled.`,
            2: `Unknown or internal error for ${method}.`,
            3: `${method} had an invalid argument.`,
            4: `${method} took too long and timed out.`,
            5: `Resource not found for ${method}.`,
            6: `Resource already exists for ${method}.`,
            7: `Permission denied for ${method}.`,
            8: `Resource exhausted for ${method}.`,
            9: `Precondition failed for ${method}.`,
            10: `${method} was aborted.`,
            11: `${method} accessed an out-of-range value.`,
            12: `${method} is not implemented.`,
            13: `Internal server error for ${method}.`,
            14: `Service unavailable for ${method}.`,
            15: `Unrecoverable data loss in ${method}.`,
            16: `Authentication failed for ${method}.`,
        };
    }
    async encodePayload(method, payload) {
        const requestType = this.clnNode.lookupType(`cln.${method}Request`);
        const errMsg = requestType.verify(payload);
        if (errMsg)
            throw new GRPCError(HttpStatusCode.GRPC_UNKNOWN, errMsg);
        const requestPayload = requestType.create(payload);
        const encodedPayload = requestType.encode(requestPayload).finish();
        const flags = Buffer.alloc(1);
        flags.writeUInt8(0, 0);
        const header = Buffer.alloc(4);
        header.writeUInt32BE(encodedPayload.length, 0);
        logger.debug(requestType.decode(encodedPayload));
        return Buffer.concat([flags, header, encodedPayload]);
    }
    async sendRequest(methodUrl, encodedPayload) {
        try {
            const timestamp = Buffer.alloc(8);
            timestamp.writeUInt32BE(Math.floor(Date.now() / 1000), 4);
            const extendedAxiosConfig = {
                ...this.axiosConfig,
                headers: {
                    ...this.axiosConfig.headers,
                    glts: timestamp.toString('base64'),
                },
            };
            return await axios.post(`${methodUrl}`, encodedPayload, extendedAxiosConfig);
        }
        catch (error) {
            logger.error(`Request failed for ${methodUrl}:`, error);
            throw new GRPCError(error.response?.status || error.code || HttpStatusCode.GRPC_UNKNOWN, error.response?.statusText || error.response?.data || error.message || '');
        }
    }
    CamelToSnakeCase(key) {
        // convert camelCase keys to snake_case but do not change ENUMS_WITH_UNDERSCORES like CHANNELD_NORMAL
        return key.includes('_') ? key : key.replace(/[A-Z]/g, match => `_${match.toLowerCase()}`);
    }
    transformResData(key, value) {
        const transformedKey = this.CamelToSnakeCase(key);
        if (Buffer.isBuffer(value) || value instanceof Uint8Array) {
            return { [transformedKey]: Buffer.from(value).toString('hex') };
        }
        if (typeof value === 'object' && value !== null && 'msat' in value) {
            // FIXME: Amount.varify check will work with 0 NOT '0'. Amount default is '0'.
            const msatValue = parseInt(value.msat);
            if (!isNaN(msatValue)) {
                return { [transformedKey]: msatValue };
            }
        }
        if (typeof value === 'object' && value !== null) {
            if (Array.isArray(value)) {
                return { [transformedKey]: value.map(item => this.transformResKeys(item)) };
            }
            else {
                return { [transformedKey]: this.transformResKeys(value) };
            }
        }
        return { [transformedKey]: value };
    }
    transformResKeys(obj) {
        if (typeof obj !== 'object' || obj === null)
            return obj;
        const transformedObj = {};
        for (const [key, value] of Object.entries(obj)) {
            const transformedEntry = this.transformResData(key, value);
            Object.assign(transformedObj, transformedEntry);
        }
        return transformedObj;
    }
    preserveEnums(data) {
        if (data.channels) {
            data.channels.forEach((channel) => {
                if (channel.state && !channel.state.includes('_')) {
                    channel.state = channel.state
                        .replace(/([A-Z])/g, '_$1')
                        .toUpperCase()
                        .replace('_', '');
                }
            });
        }
        return data;
    }
    extractRpcError(errorMessage) {
        const rpcErrorMatch = errorMessage.match(/RpcError\s*\{([^}]+)\}/);
        if (!rpcErrorMatch) {
            return errorMessage;
        }
        try {
            const rpcErrorMessageMatch = errorMessage.match(/message: "([^"]*(?:"[^"]*"[^"]*)*)"/);
            return rpcErrorMessageMatch && rpcErrorMessageMatch[1]
                ? rpcErrorMessageMatch[1].replaceAll('\\', '')
                : errorMessage;
        }
        catch (error) {
            return errorMessage;
        }
    }
    decodeResponse(method, response) {
        const responseType = this.clnNode.lookupType(`cln.${method}Response`);
        const dataBuffer = Buffer.from(response.data || '');
        const resFlag = dataBuffer.subarray(0, 1);
        const resDataLength = dataBuffer.subarray(1, 5);
        const responseData = dataBuffer.subarray(5);
        const grpcStatus = Number(response.headers['grpc-status']);
        if (grpcStatus !== 0) {
            let errorMessage;
            try {
                errorMessage = decodeURIComponent(new TextDecoder('utf-8').decode(responseData));
                if (errorMessage !== 'None') {
                    errorMessage = this.extractRpcError(errorMessage);
                }
                else {
                    errorMessage = GRPCService.getGrpcStatusMessages(method)[grpcStatus];
                }
            }
            catch {
                errorMessage = 'Invalid gRPC error response';
            }
            // Offset gRPC status code by 550:return ensure a valid HTTP 5xx server error code
            throw new GRPCError(550 + grpcStatus || HttpStatusCode.GRPC_UNKNOWN, errorMessage);
        }
        const decodedResponse = responseType.toObject(responseType.decode(responseData), {
            longs: String,
            enums: String,
            bytes: Buffer,
            defaults: true,
            arrays: true,
            objects: true,
        });
        const transformedResponse = this.transformResKeys(decodedResponse);
        const preserveEnumsInResponse = this.preserveEnums(transformedResponse);
        return JSON.parse(JSON.stringify(preserveEnumsInResponse));
    }
    convertMethodName(method) {
        const methodMapping = {
            'bkpr-listaccountevents': 'BkprListAccountEvents',
            createrune: 'CreateRune',
            fetchinvoice: 'FetchInvoice',
            fundchannel: 'FundChannel',
            newaddr: 'NewAddr',
            keysend: 'KeySend',
            listfunds: 'ListFunds',
            listinvoices: 'ListInvoices',
            listnodes: 'ListNodes',
            listoffers: 'ListOffers',
            listpeers: 'ListPeers',
            listpeerchannels: 'ListPeerChannels',
            listsendpays: 'ListSendPays',
        };
        const formattedMethod = method.charAt(0).toUpperCase() + method.slice(1).toLowerCase();
        return [methodMapping[method] || formattedMethod, formattedMethod];
    }
    transformTypes(type, valueToTransform) {
        switch (type) {
            case 'Amount':
                const AmountType = this.clnNode.lookupType('cln.Amount');
                return AmountType.create({ msat: valueToTransform });
            case 'AmountOrAll':
                const AmountOrAllType = this.clnNode.lookupType('cln.AmountOrAll');
                if (valueToTransform === 'all') {
                    return AmountOrAllType.create({ [valueToTransform]: true });
                }
                else {
                    return AmountOrAllType.create({
                        amount: this.transformTypes('Amount', valueToTransform),
                    });
                }
            case 'AmountOrAny':
                const AmountOrAnyType = this.clnNode.lookupType('cln.AmountOrAny');
                if (valueToTransform === 'any') {
                    return AmountOrAnyType.create({ [valueToTransform]: true });
                }
                else {
                    return AmountOrAnyType.create({
                        amount: this.transformTypes('Amount', valueToTransform),
                    });
                }
            case 'Feerate':
                const FeerateType = this.clnNode.lookupType(`cln.Feerate`);
                return FeerateType.create({ [valueToTransform]: true });
            default:
                break;
        }
    }
    snakeToCamel(str) {
        return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    }
    changeKeysToCamelCase(obj) {
        if (Array.isArray(obj)) {
            return obj.map(this.changeKeysToCamelCase);
        }
        else if (typeof obj === 'object' && obj !== null) {
            const newObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const newKey = this.snakeToCamel(key);
                    newObj[newKey] = this.changeKeysToCamelCase(obj[key]);
                }
            }
            return newObj;
        }
        return obj;
    }
    transformPayload(method, payload) {
        try {
            if (method?.toLowerCase() === 'fundchannel') {
                payload.id = Buffer.from(payload.id, 'hex').toString('base64');
                payload.amount = this.transformTypes('AmountOrAll', payload.amount * 1000);
                payload.feerate = this.transformTypes('Feerate', payload.feerate);
            }
            if (method?.toLowerCase() === 'withdraw') {
                payload.satoshi = this.transformTypes('AmountOrAll', payload.satoshi * 1000);
                payload.feerate = this.transformTypes('Feerate', payload.feerate);
            }
            if (method?.toLowerCase() === 'invoice') {
                payload.amount_msat = this.transformTypes('AmountOrAny', payload.amount_msat);
            }
            if (method?.toLowerCase() === 'keysend') {
                payload.destination = Buffer.from(payload.destination, 'hex').toString('base64');
                payload.amount_msat = this.transformTypes('Amount', payload.amount_msat);
            }
            if (method?.toLowerCase() === 'pay') {
                payload.amount_msat = this.transformTypes('Amount', payload.amount_msat);
            }
            // Map values with their Enums
            const enumsMapping = {
                Feerates: ['style'],
                Newaddr: ['addresstype'],
            };
            const fieldNames = enumsMapping[method];
            if (fieldNames) {
                fieldNames.forEach(fieldName => {
                    const capitalizedFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase();
                    const fieldEnum = this.clnNode.lookupEnum(`cln.${method}${capitalizedFieldName}`);
                    payload[fieldName] = fieldEnum.values[payload[fieldName].toUpperCase()];
                });
            }
            return this.changeKeysToCamelCase(payload);
        }
        catch (error) {
            throw new GRPCError(HttpStatusCode.INVALID_DATA, error.message || 'Unknown');
        }
    }
    async callMethod(methodName, reqPayload) {
        if (methodName?.toLowerCase() === 'bkpr-listaccountevents') {
            let data = {};
            if (GRPC_CONFIG.pubkey === '0279da9a93e50b008a7ba6bd25355fb7132f5015b790a05ee9f41bc9fbdeb30d19') {
                data = JSON.parse(await fs.readFileSync(path.join(process.cwd(), '../../data/dummy/node-1.json'), 'utf8'))['bkpr-listaccountevents'];
            }
            else {
                data = JSON.parse(await fs.readFileSync(path.join(process.cwd(), '../../data/dummy/node-3.json'), 'utf8'))['bkpr-listaccountevents'];
            }
            return data;
        }
        else {
            const [method, capitalizedMethod] = this.convertMethodName(methodName);
            reqPayload = this.transformPayload(capitalizedMethod, reqPayload);
            const encodedPayload = await this.encodePayload(capitalizedMethod, reqPayload);
            logger.info(`Calling gRPC method: ${capitalizedMethod}`);
            logger.debug('Payload: ', reqPayload);
            try {
                const response = await this.sendRequest(method, encodedPayload);
                logger.debug('Response Headers: ', response?.headers);
                return this.decodeResponse(capitalizedMethod, response);
            }
            catch (error) {
                logger.error(`Error calling ${capitalizedMethod}: `, error);
                throw new GRPCError(error.response?.status || error.code || HttpStatusCode.GRPC_UNKNOWN, error.response?.statusText || error.response?.data || error.message || '');
            }
        }
    }
}
