import express from 'express';
import { CommonRoutesConfig } from '../../shared/routes.config.js';
import { AuthController } from '../../controllers/auth.js';
import { LightningController } from '../../controllers/lightning.js';
import { API_VERSION } from '../../shared/consts.js';
import { NodeManager } from '../../service/node-manager.service.js';

const LIGHTNING_ROOT_ROUTE = '/cln';

export class LightningRoutes extends CommonRoutesConfig {
  private nodeManager: NodeManager;

  constructor(app: express.Application, nodeManager: NodeManager) {
    super(app, 'Lightning Routes');
    this.nodeManager = nodeManager;
  }

  configureRoutes() {
    const authController = new AuthController();
    const lightningController = new LightningController(this.nodeManager);
    this.app
      .route(API_VERSION + LIGHTNING_ROOT_ROUTE + '/call')
      .post(authController.isUserAuthenticated, lightningController.callMethod);

    return this.app;
  }
}
