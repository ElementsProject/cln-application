import { HttpStatusCode } from './consts.js';
import { logger } from './logger.js';
function handleError(error, req, res, next) {
    const route = req.url || '';
    const message = error.message
        ? error.message
        : typeof error === 'object'
            ? JSON.stringify(error)
            : typeof error === 'string'
                ? error
                : 'Unknown Error!';
    logger.error(message, route, error.stack);
    return res.status(error.code || HttpStatusCode.INTERNAL_SERVER).json(message);
}
export default handleError;
