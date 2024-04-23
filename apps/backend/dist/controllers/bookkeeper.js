import handleError from '../shared/error-handler.js';
import { LNMessage } from '../service/lightning.service.js';
import { logger } from '../shared/logger.js';
const lnMessage = LNMessage;
class BookkeeperController {
    query(req, res, next) {
        try {
            logger.info('Calling bkpr method: ' + req.body.method);
            lnMessage
                .call(req.body.method, req.body.params)
                .then((commandRes) => {
                logger.info('Controller received response for ' +
                    req.body.method +
                    ': ' +
                    JSON.stringify(commandRes));
                res.status(200).json(commandRes);
            })
                .catch((err) => {
                logger.error('Controller caught lightning error from ' +
                    req.body.method +
                    ': ' +
                    JSON.stringify(err));
                return handleError(err, req, res, next);
            });
        }
        catch (error) {
            return handleError(error, req, res, next);
        }
    }
}
export default new BookkeeperController();
