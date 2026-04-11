import express from 'express';
import { CommonRoutesConfig } from '../../shared/routes.config.js';
import { AuthController } from '../../controllers/auth.js';
import { NodesController } from '../../controllers/nodes.js';
import { API_VERSION } from '../../shared/consts.js';
import { NodeManager } from '../../service/node-manager.service.js';

const NODES_ROOT_ROUTE = '/nodes';

export class NodesRoutes extends CommonRoutesConfig {
  private nodeManager: NodeManager;

  constructor(app: express.Application, nodeManager: NodeManager) {
    super(app, 'Nodes Routes');
    this.nodeManager = nodeManager;
  }

  configureRoutes() {
    const authController = new AuthController();
    const nodesController = new NodesController(this.nodeManager);

    // GET /v1/nodes — list all profiles
    this.app
      .route(API_VERSION + NODES_ROOT_ROUTE)
      .get(authController.isUserAuthenticated, nodesController.listProfiles);

    // POST /v1/nodes — add a new profile
    this.app
      .route(API_VERSION + NODES_ROOT_ROUTE)
      .post(authController.isUserAuthenticated, nodesController.addProfile);

    // GET /v1/nodes/active — get the active profile
    this.app
      .route(API_VERSION + NODES_ROOT_ROUTE + '/active')
      .get(authController.isUserAuthenticated, nodesController.getActiveProfile);

    // POST /v1/nodes/switch — switch to a different profile
    this.app
      .route(API_VERSION + NODES_ROOT_ROUTE + '/switch')
      .post(authController.isUserAuthenticated, nodesController.switchNode);

    // POST /v1/nodes/discover — scan for nodes
    this.app
      .route(API_VERSION + NODES_ROOT_ROUTE + '/discover')
      .post(authController.isUserAuthenticated, nodesController.discoverNodes);

    // DELETE /v1/nodes/:id — remove a profile
    this.app
      .route(API_VERSION + NODES_ROOT_ROUTE + '/:id')
      .delete(authController.isUserAuthenticated, nodesController.removeProfile);

    return this.app;
  }
}
