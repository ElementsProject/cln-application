import * as fs from 'fs';
import * as net from 'net';
import { Request, Response, NextFunction } from 'express';

import {
  APP_CONSTANTS,
  HttpStatusCode,
  SESSION_COOKIE_ATTRIBUTES,
  SESSION_COOKIE_OPTIONS,
} from '../shared/consts.js';
import { logger } from '../shared/logger.js';
import handleError from '../shared/error-handler.js';
import {
  createSessionToken,
  hashPassword,
  isAuthenticated,
  isValidPassword,
  revokeAllSessions,
  revokeSession,
  verifyPassword,
  verifyStoredPassword,
} from '../shared/utils.js';
import { AuthError } from '../models/errors.js';

export class AuthController {
  userLogin = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Logging in');
    try {
      const password = req.body?.password;
      if (typeof password !== 'string' || password === '' || password.length > 256) {
        return handleError(
          new AuthError(HttpStatusCode.BAD_REQUEST, 'Password is required'),
          req,
          res,
          next,
        );
      }
      const vpRes = await verifyPassword(password);
      if (vpRes === true) {
        res.cookie('token', createSessionToken(), SESSION_COOKIE_OPTIONS);
        return res.status(201).json({ isAuthenticated: true, isValidPassword: isValidPassword() });
      } else {
        const message = vpRes instanceof Error ? vpRes.message : vpRes;
        handleError(new AuthError(HttpStatusCode.UNAUTHORIZED, message), req, res, next);
      }
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  };

  userLogout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Logging out');
      revokeSession(req.cookies?.token);
      res.clearCookie('token', SESSION_COOKIE_ATTRIBUTES);
      res.status(201).json({ isAuthenticated: false, isValidPassword: isValidPassword() });
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Resetting password');
      const currPassword = req.body?.currPassword;
      const newPassword = req.body?.newPassword;

      if (
        typeof newPassword !== 'string' ||
        newPassword.trim() === '' ||
        newPassword.length > 256
      ) {
        return handleError(
          new AuthError(HttpStatusCode.BAD_REQUEST, 'New password is required'),
          req,
          res,
          next,
        );
      }
      if (!fs.existsSync(APP_CONSTANTS.APP_CONFIG_FILE)) {
        return handleError(
          new AuthError(HttpStatusCode.UNAUTHORIZED, 'Config file does not exist'),
          req,
          res,
          next,
        );
      }

      const config = JSON.parse(fs.readFileSync(APP_CONSTANTS.APP_CONFIG_FILE, 'utf-8'));
      const passwordAlreadySet = typeof config.password === 'string' && config.password !== '';
      if (!passwordAlreadySet) {
        // Before a password exists, only accept the request from the server's own address so a
        // DNS-rebinding page on some other domain cannot claim the install
        const host = String(req.hostname || '').replace(/^\[|\]$/g, '');
        const firstRunHostOk =
          host === 'localhost' ||
          net.isIP(host) !== 0 ||
          host === APP_CONSTANTS.APP_HOST ||
          /\.(local|onion)$/.test(host);
        if (!firstRunHostOk) {
          return handleError(
            new AuthError(
              HttpStatusCode.FORBIDDEN,
              'Set the first password from the server address, not from ' + host,
            ),
            req,
            res,
            next,
          );
        }
      } else {
        const hasSession =
          APP_CONSTANTS.APP_SINGLE_SIGN_ON === 'true' ||
          isAuthenticated(req.cookies?.token) === true;
        if (!hasSession) {
          return res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'Unauthorized user' });
        }
        const { ok } = await verifyStoredPassword(config.password, currPassword);
        if (!ok) {
          return handleError(
            new AuthError(HttpStatusCode.UNAUTHORIZED, 'Incorrect current password'),
            req,
            res,
            next,
          );
        }
      }

      config.password = await hashPassword(newPassword);
      fs.writeFileSync(APP_CONSTANTS.APP_CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
      revokeAllSessions();
      res.cookie('token', createSessionToken(), SESSION_COOKIE_OPTIONS);
      return res.status(201).json({ isAuthenticated: true, isValidPassword: isValidPassword() });
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  };

  isUserAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uaRes = isAuthenticated(req.cookies.token);
      if (req.body?.returnResponse || false) {
        // Frontend is asking if user is authenticated or not
        if (APP_CONSTANTS.APP_SINGLE_SIGN_ON === 'true') {
          return res.status(201).json({ isAuthenticated: true, isValidPassword: true });
        } else {
          const vpRes = isValidPassword();
          if (uaRes === true) {
            if (vpRes === true) {
              return res.status(201).json({ isAuthenticated: true, isValidPassword: true });
            } else {
              return res.status(201).json({ isAuthenticated: true, isValidPassword: vpRes });
            }
          } else {
            return res.status(201).json({ isAuthenticated: false, isValidPassword: vpRes });
          }
        }
      } else {
        // Backend APIs are asking if user is authenticated or not
        if (uaRes === true || APP_CONSTANTS.APP_SINGLE_SIGN_ON === 'true') {
          return next();
        } else {
          return res.status(401).json({ error: 'Unauthorized user' });
        }
      }
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  };
}
