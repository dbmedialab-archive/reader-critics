import {
	Request,
	Response,
	Router,
} from 'express';

import * as bodyParser from 'body-parser';
import Auth from '../middleware/Auth';

import * as app from 'app/util/applib';

const log = app.createLog();

// Prepare and export Express router

const adminRoute : Router = Router();

adminRoute.use(bodyParser.urlencoded({
	inflate: true,
	limit: '512kb',
}));

adminRoute.route('/token').post(Auth.authenticate, Auth.generateToken, Auth.respondJWT);

export default adminRoute;
