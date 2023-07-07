import express from 'express';
import { CommonRoutesConfig } from '../../shared/routes.config.js';
import SharedController from '../../controllers/shared.js';
import { API_VERSION } from '../../shared/consts.js';

const SHARED_ROUTE = '/shared';

export class SharedRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'Shared Routes');
  }

  configureRoutes() {
    this.app.route(API_VERSION + SHARED_ROUTE + '/csrf/').get((req, res, next) => {
      res.send({
        csrfToken:
          req.csrfToken && typeof req.csrfToken === 'function' ? req.csrfToken() : 'not-set',
      });
    });
    this.app
      .route(API_VERSION + SHARED_ROUTE + '/config/')
      .get(SharedController.getApplicationSettings);
    this.app
      .route(API_VERSION + SHARED_ROUTE + '/config/')
      .post(SharedController.setApplicationSettings);
    this.app
      .route(API_VERSION + SHARED_ROUTE + '/connectwallet/')
      .get(SharedController.getWalletConnectSettings);
    this.app
      .route(API_VERSION + SHARED_ROUTE + '/rate/:fiatCurrency')
      .get(SharedController.getFiatRate);
    return this.app;
  }
}
