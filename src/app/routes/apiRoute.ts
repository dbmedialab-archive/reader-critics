import {
	Request,
	Response,
	Router,
} from 'express';

import * as bodyParser from 'body-parser';

import articleHandler from './api/articleHandler';
import feedbackPostHandler from './api/feedbackPostHandler';

import * as app from 'app/util/applib';

const log = app.createLog();

// Prepare and export Express router

const apiRoute : Router = Router();

apiRoute.use(bodyParser.json({
	inflate: true,
	limit: '512kb',
	strict: true,
}));

apiRoute.get('/article', articleHandler);
apiRoute.put('/feedback', feedbackPostHandler);

apiRoute.get('/*', defaultHandler);

export default apiRoute;

function defaultHandler(requ : Request, resp : Response) : void {
	log('Default API router');
	resp.status(404).end('Unknown API endpoint\n');
}
