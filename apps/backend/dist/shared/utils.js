import jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { APP_CONSTANTS, SECRET_KEY } from '../shared/consts.js';
export var applicationConfig = null;
export function overrideSettingsWithEnvVariables(config) {
    config.singleSignOn =
        (process.env.SINGLE_SIGN_ON && process.env.SINGLE_SIGN_ON === 'true') || false;
    return config;
}
export function setSharedApplicationConfig(config) {
    try {
        applicationConfig = config;
    }
    catch (error) {
        throw error;
    }
}
export function isAuthenticated(token) {
    try {
        if (!token) {
            return 'Token missing';
        }
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            return !!decoded.userID;
        }
        catch (error) {
            return error.message || 'Invalid user';
        }
    }
    catch (error) {
        return error;
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
                return 'Incorrect password';
            }
        }
        catch (error) {
            return error;
        }
    }
    else {
        return 'Config file does not exist';
    }
}
export function isValidPassword() {
    if (fs.existsSync(APP_CONSTANTS.CONFIG_LOCATION)) {
        try {
            const config = JSON.parse(fs.readFileSync(APP_CONSTANTS.CONFIG_LOCATION, 'utf-8'));
            if (config.password && config.password !== '') {
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            return error;
        }
    }
    else {
        return 'Config file does not exist';
    }
}
