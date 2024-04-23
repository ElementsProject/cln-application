import { CommonRoutesConfig } from '../../shared/routes.config.js';
import AuthController from '../../controllers/auth.js';
import BookkeeperController from '../../controllers/bookkeeper.js';
import { API_VERSION } from '../../shared/consts.js';
const BOOKKEEPER_ROOT_ROUTE = '/bkpr'; //maybe i want it in /cln if that makes the most sense? does it?
//no i dont need a new route or anything, just use /call with the sql method.  this isnt buying me anything...
export class BookkeeperRoutes extends CommonRoutesConfig {
    constructor(app) {
        super(app, 'Bookkeeper Routes');
    }
    configureRoutes() {
        this.app
            .route(API_VERSION + BOOKKEEPER_ROOT_ROUTE + '/query')
            .post(AuthController.isUserAuthenticated, BookkeeperController.query);
        return this.app;
    }
}
