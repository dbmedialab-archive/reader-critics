import {
	Request,
	Response,
	Router,
} from 'express';

import * as passport from 'passport';
import * as app from 'app/util/applib';
import * as bodyParser from 'body-parser';
import usersHandler from './usersHandler';
import Auth from 'app/middleware/Auth';

const log = app.createLog();

const adminApiRoute : Router = Router();

passport.use(Auth.jwtStrategy);
passport.serializeUser(Auth.serializeUser);
passport.deserializeUser(Auth.deserializeUser);

adminApiRoute.use(bodyParser.urlencoded({
	extended: true,
}));

adminApiRoute.post('/login', Auth.loginHandler);

adminApiRoute.use(passport.initialize());
adminApiRoute.use(passport.session());

adminApiRoute.use('/*', passport.authenticate('jwt', {session: true}));

adminApiRoute.get('/users', usersHandler);
adminApiRoute.get('/*', defaultHandler);

export default adminApiRoute;

function defaultHandler(requ, resp) : void {
	log('Admin api router', requ.params);
	resp.status(404).end('Unknown admin api endpoint\n');
}
