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

adminRoute.get('/login', isLoggedOff, loginPageHandler);
adminRoute.post('/login', isLoggedOff, loginHandler);
adminRoute.get('/logout', isLoggedIn, logoutHandler);
adminRoute.get('/testpage', isLoggedIn, testPageHandler);
adminRoute.get('/*', defaultHandler);

export default adminRoute;

function defaultHandler(requ : Request, resp : Response) : void {
	log('Admin router', requ.params);
	resp.status(404).end('Unknown admin endpoint\n');
}

function isLoggedOff(req, res, next: () => void): void {
	if (!req.isAuthenticated()) {
		return next();
	}
	res.redirect('testpage');
}

function isLoggedIn(req, res, next: () => void): void {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('login');
}
