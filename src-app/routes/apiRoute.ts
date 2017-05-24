import {
	Request,
	Response,
	Router,
} from 'express';

import articleHandler from './api/articleHandler';

import * as app from 'app/util/applib';

const log = app.createLog();

// Prepare and export Express router

const apiRoute : Router = Router();

apiRoute.get('/article/*', articleHandler);

apiRoute.get('/*', defaultHandler);

export default apiRoute;

function defaultHandler(requ : Request, resp : Response) : void {
	log('Default API router');
	resp.status(404).end('Unknown API endpoint');
}
