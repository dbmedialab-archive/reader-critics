import {
	Request,
	Response,
	Router,
} from 'express';

import * as app from 'app/util/applib';

//TO DO remove this test handler
import adminPageHandler from './ui/adminPageHandler';

const log = app.createLog();

const adminRoute : Router = Router();

adminRoute.get(['/users'], adminPageHandler);
adminRoute.get('/*', notFoundHandler);

export default adminRoute;

function notFoundHandler(requ : Request, resp : Response) : void {
	log('Admin router', requ.params);
	resp.status(404).end('Unknown admin endpoint\n');
}
