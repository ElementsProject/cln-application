import jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { Request, Response, NextFunction } from 'express';

import { APP_CONSTANTS, HttpStatusCode, SECRET_KEY } from '../shared/consts.js';
import { logger } from '../shared/logger.js';
import handleError from '../shared/error-handler.js';
import {
  verifyPassword,
  isAuthenticated,
  isValidPassword,
  applicationConfig,
} from '../shared/utils.js';
import { AuthError } from '../models/errors.js';

class AuthController {
  userLogin(req: Request, res: Response, next: NextFunction) {
    logger.info('Logging in');
    try {
      const vpRes = verifyPassword(req.body.password);
      if (vpRes === true) {
        const token = jwt.sign({ userID: SECRET_KEY }, SECRET_KEY);
        // Expire the token in a day
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 * 24 });
        return res.status(201).json({ isAuthenticated: true, isValidPassword: isValidPassword() });
      } else {
        const err = new AuthError(vpRes, vpRes, HttpStatusCode.UNAUTHORIZED, vpRes);
        handleError(err, req, res, next);
      }
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  }

  userLogout(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Logging out');
      res.clearCookie('token');
      res.status(201).json({ isAuthenticated: false, isValidPassword: isValidPassword() });
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  }

  resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Resetting password');
      const isValid = req.body.isValid;
      const currPassword = req.body.currPassword;
      const newPassword = req.body.newPassword;
      if (fs.existsSync(APP_CONSTANTS.CONFIG_LOCATION)) {
        try {
          const config = JSON.parse(fs.readFileSync(APP_CONSTANTS.CONFIG_LOCATION, 'utf-8'));
          if (config.password === currPassword || !isValid) {
            try {
              if (typeof config.singleSignOn === 'undefined') {
                config.singleSignOn = process.env.SINGLE_SIGN_ON || false;
              }
              config.password = newPassword;
              try {
                fs.writeFileSync(
                  APP_CONSTANTS.CONFIG_LOCATION,
                  JSON.stringify(config, null, 2),
                  'utf-8',
                );
                const token = jwt.sign({ userID: SECRET_KEY }, SECRET_KEY);
                res.cookie('token', token, { httpOnly: true, maxAge: 3600 * 24 * 7 });
                res.status(201).json({ isAuthenticated: true, isValidPassword: isValidPassword() });
              } catch (error: any) {
                handleError(error, req, res, next);
              }
            } catch (error: any) {
              handleError(error, req, res, next);
            }
          } else {
            return new AuthError(
              'Incorrect current password',
              'Incorrect current password',
              HttpStatusCode.UNAUTHORIZED,
              'Incorrect current password',
            );
          }
        } catch (error: any) {
          handleError(error, req, res, next);
        }
      } else {
        throw new AuthError(
          'Config file does not exist',
          'Config file does not exist',
          HttpStatusCode.UNAUTHORIZED,
          'Config file does not exist',
        );
      }
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  }

  isUserAuthenticated(req: Request, res: Response, next: NextFunction) {
    try {
      const uaRes = isAuthenticated(req.cookies.token);
      if (req.body.returnResponse) {
        // Frontend is asking if user is authenticated or not
        if (applicationConfig?.singleSignOn === true) {
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
        if (uaRes === true || applicationConfig?.singleSignOn === true) {
          return next();
        } else {
          return res.status(401).json({ error: 'Unauthorized user' });
        }
      }
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  }
}

export default new AuthController();
