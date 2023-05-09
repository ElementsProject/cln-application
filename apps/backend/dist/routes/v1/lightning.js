import { CommonRoutesConfig } from '../../shared/routes.config.js';
import LightningController from '../../controllers/lightning.js';
import { API_VERSION } from '../../shared/consts.js';
const LIGHTNING_ROOT_ROUTE = '/cln';
export class LightningRoutes extends CommonRoutesConfig {
    constructor(app) {
        super(app, 'Lightning Routes');
    }
    configureRoutes() {
        this.app
            .route(API_VERSION + LIGHTNING_ROOT_ROUTE + '/call')
            .post(LightningController.callMethod);
        return this.app;
    }
}
