import jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { Request, Response, NextFunction } from 'express';

import { APP_CONSTANTS, HttpStatusCode, SECRET_KEY } from '../shared/consts.js';
import { logger } from '../shared/logger.js';
import handleError from '../shared/error-handler.js';
import { verifyPassword, isAuthenticated } from '../shared/utils.js';
import { AuthError } from '../models/errors.js';

class AuthController {
  userLogin(req: Request, res: Response, next: NextFunction) {
    logger.info('Logging in');
    try {
      if (verifyPassword(req.body.password)) {
        const token = jwt.sign({ userID: SECRET_KEY }, SECRET_KEY);
        res.cookie('token', token, { httpOnly: true, maxAge: 3600 * 24 * 7 });
        res.status(200).json({ isAuthenticated: true });
      }
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  }

  userLogout(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Logging out');
      res.clearCookie('token');
      res.status(401).json({ isAuthenticated: false });
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  }

  resetPassword(req: Request, res: Response, next: NextFunction) {
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
                fs.writeFileSync(
                  APP_CONSTANTS.CONFIG_LOCATION,
                  JSON.stringify(config, null, 2),
                  'utf-8',
                );
                const token = jwt.sign({ userID: SECRET_KEY }, SECRET_KEY);
                res.cookie('token', token, { httpOnly: true, maxAge: 3600 * 24 * 7 });
                res.status(200).json({ isAuthenticated: true });
              } catch (error: any) {
                handleError(error, req, res, next);
              }
            } catch (error: any) {
              handleError(error, req, res, next);
            }
          } else {
            return new AuthError(
              'Incorrect password',
              'Incorrect password',
              HttpStatusCode.UNAUTHORIZED,
              'Incorrect password',
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
      if (isAuthenticated(req.cookies.token)) {
        return next();
      }
      res.status(401).json({ error: 'Unauthorized user' });
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  }

}

export default new AuthController();
