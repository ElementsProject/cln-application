import { HttpStatusCode } from './consts.js';
import { logger } from './logger.js';
function handleError(error, req, res, next) {
    var route = req.url || '';
    var message = error.message
        ? error.message
        : error.error
            ? error.error
            : typeof error === 'object'
                ? JSON.stringify(error)
                : typeof error === 'string'
                    ? error
                    : 'Unknow Error!';
    logger.error(message, route, error.stack);
    return res.status(error.statusCode || HttpStatusCode.INTERNAL_SERVER).json(message);
}
export default handleError;
