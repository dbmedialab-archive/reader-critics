import {
	Request,
	Response,
	Router,
} from 'express';

import * as passport from 'passport';
import * as app from 'app/util/applib';
import * as bodyParser from 'body-parser';
import usersHandler from './usersHandler';
import {apiLoginHandler} from 'app/middleware/Auth';
import { jwtStrategy, serializeUser, deserializeUser } from 'app/middleware/config/passportConfig';

const log = app.createLog();

const adminApiRoute : Router = Router();

adminApiRoute.use(bodyParser.urlencoded({
	extended: true,
}));

/**
 * All api request that have to pass without authentication have to be placed here
 */
adminApiRoute.post('/login', apiLoginHandler);

// Protecting routes with jwt
adminApiRoute.use('/*', passport.authenticate('jwt', {session: true}));
/**
 * All api request that have NOT to to pass without authentication have to be placed here
 */
adminApiRoute.get('/users', usersHandler);
adminApiRoute.get('/*', defaultHandler);

export default adminApiRoute;

function defaultHandler(requ: Request, resp: Response) : void {
	log('Admin api router', requ.params);
	resp.status(404).end('Unknown admin api endpoint\n');
}
