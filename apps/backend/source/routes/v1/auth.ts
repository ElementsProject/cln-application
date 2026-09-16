import express from 'express';
import rateLimit from 'express-rate-limit';
import { CommonRoutesConfig } from '../../shared/routes.config.js';
import { AuthController } from '../../controllers/auth.js';
import { API_VERSION } from '../../shared/consts.js';

const AUTH_ROUTE = '/auth';
const AUTH_WINDOW_MS = 15 * 60 * 1000;
const AUTH_MAX_FAILURES = 5;

export const authAttemptLimiter = rateLimit({
  windowMs: AUTH_WINDOW_MS,
  limit: AUTH_MAX_FAILURES,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  keyGenerator: () => 'auth',
  validate: { trustProxy: false, keyGeneratorIpFallback: false, xForwardedForHeader: false },
  message: { message: 'Too many failed attempts. Try in 15 minutes.' },
});

export class AuthRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'Auth Routes');
  }

  configureRoutes() {
    const authController = new AuthController();
    this.app.route(API_VERSION + AUTH_ROUTE + '/logout/').get(authController.userLogout);
    this.app
      .route(API_VERSION + AUTH_ROUTE + '/login/')
      .post(authAttemptLimiter, authController.userLogin);
    this.app
      .route(API_VERSION + AUTH_ROUTE + '/reset/')
      .post(authAttemptLimiter, authController.resetPassword);
    this.app
      .route(API_VERSION + AUTH_ROUTE + '/isauthenticated/')
      .post(authController.isUserAuthenticated);
    return this.app;
  }
}
