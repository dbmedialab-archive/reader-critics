import {
	Request,
	Response,
	Router,
} from 'express';

import * as app from 'app/util/applib';

//TO DO remove this test handler
import testPageHandler from './ui/testPageHandler/index';

const log = app.createLog();

const adminRoute : Router = Router();

adminRoute.get('/testpage', testPageHandler);
adminRoute.get('/*', defaultHandler);

export default adminRoute;

function defaultHandler(requ : Request, resp : Response) : void {
	log('Admin router', requ.params);
	resp.status(404).end('Unknown admin endpoint\n');
}
