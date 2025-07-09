import express from 'express';
import { CommonRoutesConfig } from '../../shared/routes.config.js';
import { AuthController } from '../../controllers/auth.js';
import { LightningController } from '../../controllers/lightning.js';
import { API_VERSION } from '../../shared/consts.js';
import { LightningService } from '../../service/lightning.service.js';

const LIGHTNING_ROOT_ROUTE = '/cln';

export class LightningRoutes extends CommonRoutesConfig {
  private clnService: LightningService;

  constructor(app: express.Application, clnService: LightningService) {
    super(app, 'Lightning Routes');
    this.clnService = clnService;
  }

  configureRoutes() {
    const authController = new AuthController();
    const lightningController = new LightningController(this.clnService);
    this.app
      .route(API_VERSION + LIGHTNING_ROOT_ROUTE + '/call')
      .post(authController.isUserAuthenticated, lightningController.callMethod);

    return this.app;
  }
}
