import {
	Request,
	Response,
	Router,
} from 'express';

import * as app from 'app/util/applib';
import * as bodyParser from 'body-parser';
import usersHandler from './usersHandler';

const log = app.createLog();

const adminApiRoute : Router = Router();

adminApiRoute.use(bodyParser.json({
	inflate: true,
	limit: '512kb',
	strict: true,
}));

adminApiRoute.get('/users', usersHandler);
adminApiRoute.get('/*', defaultHandler);

export default adminApiRoute;

function defaultHandler(requ : Request, resp : Response) : void {
	log('Admin api router', requ.params);
	resp.status(404).end('Unknown admin api endpoint\n');
}
