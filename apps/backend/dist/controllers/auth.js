import jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { APP_CONSTANTS, HttpStatusCode, SECRET_KEY } from '../shared/consts.js';
import { logger } from '../shared/logger.js';
import handleError from '../shared/error-handler.js';
import { verifyPassword, isAuthenticated } from '../shared/utils.js';
import { AuthError } from '../models/errors.js';
class AuthController {
    userLogin(req, res, next) {
        logger.info('Logging in');
        try {
            if (verifyPassword(req.body.password)) {
                const token = jwt.sign({ userID: SECRET_KEY }, SECRET_KEY);
                res.cookie('token', token, { httpOnly: true, maxAge: 3600 * 24 * 7 });
                res.status(200).json({ isAuthenticated: true });
            }
        }
        catch (error) {
            handleError(error, req, res, next);
        }
    }
    userLogout(req, res, next) {
        try {
            logger.info('Logging out');
            res.clearCookie('token');
            res.status(201).json({ isAuthenticated: false });
        }
        catch (error) {
            handleError(error, req, res, next);
        }
    }
    resetPassword(req, res, next) {
        try {
            logger.info('Resetting password');
            const currPassword = req.body.currPassword;
            const newPassword = req.body.newPassword;
            if (fs.existsSync(APP_CONSTANTS.CONFIG_LOCATION)) {
                try {
                    const config = JSON.parse(fs.readFileSync(APP_CONSTANTS.CONFIG_LOCATION, 'utf-8'));
                    if (config.password === currPassword) {
                        try {
                            config.password = newPassword;
                            delete config.password;
                            try {
                                fs.writeFileSync(APP_CONSTANTS.CONFIG_LOCATION, JSON.stringify(config, null, 2), 'utf-8');
                                const token = jwt.sign({ userID: SECRET_KEY }, SECRET_KEY);
                                res.cookie('token', token, { httpOnly: true, maxAge: 3600 * 24 * 7 });
                                res.status(200).json({ isAuthenticated: true });
                            }
                            catch (error) {
                                handleError(error, req, res, next);
                            }
                        }
                        catch (error) {
                            handleError(error, req, res, next);
                        }
                    }
                    else {
                        return new AuthError('Incorrect password', 'Incorrect password', HttpStatusCode.UNAUTHORIZED, 'Incorrect password');
                    }
                }
                catch (error) {
                    handleError(error, req, res, next);
                }
            }
            else {
                throw new AuthError('Config file does not exist', 'Config file does not exist', HttpStatusCode.UNAUTHORIZED, 'Config file does not exist');
            }
        }
        catch (error) {
            handleError(error, req, res, next);
        }
    }
    isUserAuthenticated(req, res, next) {
        try {
            if (isAuthenticated(req.cookies.token)) {
                return next();
            }
            res.status(401).json({ error: 'Unauthorized user' });
        }
        catch (error) {
            handleError(error, req, res, next);
        }
    }
}
export default new AuthController();
