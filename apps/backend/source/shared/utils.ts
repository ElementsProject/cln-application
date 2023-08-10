import jwt from 'jsonwebtoken';
import * as fs from 'fs';

import { APP_CONSTANTS, SECRET_KEY } from '../shared/consts.js';
export var applicationConfig: any = null;

export function overrideSettingsWithEnvVariables(config: any) {
  config.singleSignOn =
    (process.env.SINGLE_SIGN_ON && process.env.SINGLE_SIGN_ON === 'true') || false;
  return config;
}

export function setSharedApplicationConfig(config: any) {
  try {
    applicationConfig = config;
  } catch (error: any) {
    throw error;
  }
}

export function isAuthenticated(token: string) {
  try {
    if (!token) {
      return 'Token missing';
    }
    try {
      const decoded: any = jwt.verify(token, SECRET_KEY);
      return !!decoded.userID;
    } catch (error: any) {
      return error.message || 'Invalid user';
    }
  } catch (error: any) {
    return error;
  }
}

export function verifyPassword(password: string) {
  if (fs.existsSync(APP_CONSTANTS.CONFIG_LOCATION)) {
    try {
      const config = JSON.parse(fs.readFileSync(APP_CONSTANTS.CONFIG_LOCATION, 'utf-8'));
      if (config.password === password) {
        return true;
      } else {
        return 'Incorrect password';
      }
    } catch (error: any) {
      return error;
    }
  } else {
    return 'Config file does not exist';
  }
}

export function isValidPassword() {
  if (fs.existsSync(APP_CONSTANTS.CONFIG_LOCATION)) {
    try {
      const config = JSON.parse(fs.readFileSync(APP_CONSTANTS.CONFIG_LOCATION, 'utf-8'));
      if (config.password && config.password !== '') {
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      return error;
    }
  } else {
    return 'Config file does not exist';
  }
}
