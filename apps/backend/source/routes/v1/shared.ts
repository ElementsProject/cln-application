import express from 'express';
import { CommonRoutesConfig } from '../../shared/routes.config.js';
import { AuthController } from '../../controllers/auth.js';
import { SharedController } from '../../controllers/shared.js';
import { API_VERSION } from '../../shared/consts.js';
import { LightningService } from '../../service/lightning.service.js';

const SHARED_ROUTE = '/shared';

export class SharedRoutes extends CommonRoutesConfig {
  private clnService: LightningService;

  constructor(app: express.Application, clnService: LightningService) {
    super(app, 'Shared Routes');
    this.clnService = clnService;
  }

  configureRoutes() {
    const authController = new AuthController();
    const sharedController = new SharedController(this.clnService);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.app.route(API_VERSION + SHARED_ROUTE + '/csrf/').get((req, res, next) => {
      res.send({
        csrfToken:
          req.csrfToken && typeof req.csrfToken === 'function' ? req.csrfToken() : 'not-set',
      });
    });
    this.app
      .route(API_VERSION + SHARED_ROUTE + '/config/')
      .get(sharedController.getApplicationSettings);
    this.app
      .route(API_VERSION + SHARED_ROUTE + '/config/')
      .post(authController.isUserAuthenticated, sharedController.setApplicationSettings);
    this.app
      .route(API_VERSION + SHARED_ROUTE + '/connectwallet/')
      .get(authController.isUserAuthenticated, sharedController.getWalletConnectSettings);
    this.app
      .route(API_VERSION + SHARED_ROUTE + '/rate/:fiatCurrency')
      .get(sharedController.getFiatRate);
    this.app
      .route(API_VERSION + SHARED_ROUTE + '/saveinvoicerune/')
      .post(authController.isUserAuthenticated, sharedController.saveInvoiceRune);
    return this.app;
  }
}
