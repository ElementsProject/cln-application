import jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { APP_CONSTANTS, HttpStatusCode, SECRET_KEY } from '../shared/consts.js';
import { AuthError } from '../models/errors.js';
export function isAuthenticated(token) {
    try {
        if (!token) {
            throw new AuthError('Token missing', 'Token missing', HttpStatusCode.UNAUTHORIZED, 'Token missing');
        }
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            return !!decoded.userID;
        }
        catch (error) {
            const errMsg = error.message || 'Invalid user';
            throw new AuthError(errMsg, errMsg, HttpStatusCode.UNAUTHORIZED, errMsg);
        }
    }
    catch (error) {
        throw new AuthError(error, error, HttpStatusCode.UNAUTHORIZED, error);
    }
}
export function verifyPassword(password) {
    if (fs.existsSync(APP_CONSTANTS.CONFIG_LOCATION)) {
        try {
            const config = JSON.parse(fs.readFileSync(APP_CONSTANTS.CONFIG_LOCATION, 'utf-8'));
            if (config.password === password) {
                return true;
            }
            else {
                throw new AuthError('Incorrect password', 'Incorrect password', HttpStatusCode.UNAUTHORIZED, 'Incorrect password');
            }
        }
        catch (error) {
            throw new AuthError(error, error, HttpStatusCode.UNAUTHORIZED, error);
        }
    }
    else {
        throw new AuthError('Config file does not exist', 'Config file does not exist', HttpStatusCode.UNAUTHORIZED, 'Config file does not exist');
    }
}
export function isValidPassword() {
    if (fs.existsSync(APP_CONSTANTS.CONFIG_LOCATION)) {
        try {
            const config = JSON.parse(fs.readFileSync(APP_CONSTANTS.CONFIG_LOCATION, 'utf-8'));
            if (config.password !== '') {
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            throw new AuthError(error, error, HttpStatusCode.UNAUTHORIZED, error);
        }
    }
    else {
        throw new AuthError('Config file does not exist', 'Config file does not exist', HttpStatusCode.UNAUTHORIZED, 'Config file does not exist');
    }
}
