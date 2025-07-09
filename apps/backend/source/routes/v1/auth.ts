import express from 'express';
import { CommonRoutesConfig } from '../../shared/routes.config.js';
import { AuthController } from '../../controllers/auth.js';
import { API_VERSION } from '../../shared/consts.js';

const AUTH_ROUTE = '/auth';

export class AuthRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'Auth Routes');
  }

  configureRoutes() {
    const authController = new AuthController();
    this.app.route(API_VERSION + AUTH_ROUTE + '/logout/').get(authController.userLogout);
    this.app.route(API_VERSION + AUTH_ROUTE + '/login/').post(authController.userLogin);
    this.app.route(API_VERSION + AUTH_ROUTE + '/reset/').post(authController.resetPassword);
    this.app
      .route(API_VERSION + AUTH_ROUTE + '/isauthenticated/')
      .post(authController.isUserAuthenticated);
    return this.app;
  }
}
