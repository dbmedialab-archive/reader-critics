import {
	Request,
	Response,
	Router,
} from 'express';

import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as app from 'app/util/applib';
import {apiLoginHandler, apiTestHandler} from 'app/routes/admin/api/handlers';

const log = app.createLog();

const adminApiRoute : Router = Router();

adminApiRoute.use(bodyParser.json({
	inflate: true,
	limit: '512kb',
	strict: true,
}));
adminApiRoute.use(cookieParser());

/**
 * All api request that have to pass without authentication have to be placed here
 */
adminApiRoute.post('/login', apiLoginHandler);

// Protecting routes with jwt
adminApiRoute.use('/*', passport.authenticate('jwt', {session: false}));
/**
 * All api request that have NOT to to pass without authentication have to be placed here
 */
adminApiRoute.get('/users', apiTestHandler);
adminApiRoute.get('/*', defaultHandler);

export default adminApiRoute;

function defaultHandler(requ: Request, resp: Response) : void {
	log('Admin api router', requ.params);
	resp.status(404).end('Unknown admin api endpoint\n');
}
