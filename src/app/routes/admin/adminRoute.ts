import {
	Request,
	Response,
	Router,
} from 'express';

import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as app from 'app/util/applib';
import { loginPageHandler, logoutHandler, testPageHandler, loginHandler } from './ui/handlers';
import { sessionConf } from 'app/middleware/config/sessionConfig';
import isAuthenticated from 'app/middleware/policies/isAuthenticated';
import isNotAuthenticated from 'app/middleware/policies/isNotAuthenticated';

const log = app.createLog();

const adminRoute : Router = Router();
const secret: string = sessionConf.secret;

adminRoute.use(bodyParser.json({
	inflate: true,
	limit: '512kb',
	strict: true,
}));
adminRoute.use(bodyParser.urlencoded({
	extended: true,
}));
adminRoute.use(cookieParser(secret));

adminRoute.get('/', homeRoute);
adminRoute.get('/login', isNotAuthenticated, loginPageHandler);
adminRoute.post('/login', isNotAuthenticated, loginHandler);
adminRoute.get('/logout', isAuthenticated, logoutHandler);
adminRoute.get('/testpage', isAuthenticated, testPageHandler);
adminRoute.get('/*', defaultHandler);

export default adminRoute;

function defaultHandler(requ : Request, resp : Response) : void {
	log('Admin router', requ.params);
	resp.status(404).end('Unknown admin endpoint\n');
}

function homeRoute(requ : Request, resp : Response) : void {
	resp.redirect('testpage');
}
