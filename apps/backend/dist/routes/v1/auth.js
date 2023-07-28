import { CommonRoutesConfig } from '../../shared/routes.config.js';
import AuthController from '../../controllers/auth.js';
import { API_VERSION } from '../../shared/consts.js';
const AUTH_ROUTE = '/auth';
export class AuthRoutes extends CommonRoutesConfig {
    constructor(app) {
        super(app, 'Auth Routes');
    }
    configureRoutes() {
        this.app.route(API_VERSION + AUTH_ROUTE + '/logout/').get(AuthController.userLogout);
        this.app.route(API_VERSION + AUTH_ROUTE + '/login/').post(AuthController.userLogin);
        this.app.route(API_VERSION + AUTH_ROUTE + '/reset/').post(AuthController.resetPassword);
        this.app
            .route(API_VERSION + AUTH_ROUTE + '/authenticated/')
            .post(AuthController.isUserAuthenticated);
        return this.app;
    }
}
