import {
	Request,
	Response,
	Router,
} from 'express';

import * as bodyParser from 'body-parser';

import articleHandler from './api/articleHandler';
import feedbackPostHandler from './api/feedbackPostHandler';
import suggestionHandler from './api/suggestionHandler';

import { errorResponse } from './api/apiResponse';

// Prepare and export Express router

const apiRoute : Router = Router();

apiRoute.use(bodyParser.json({
	inflate: true,
	limit: '512kb',
	strict: true,
}));

// Public API routes

apiRoute.get('/article', articleHandler);

apiRoute.post('/feedback', feedbackPostHandler);
apiRoute.post('/suggest', suggestionHandler);

apiRoute.get('/*', defaultHandler);

export default apiRoute;

// Default handler for unknown routes

function defaultHandler(requ : Request, resp : Response) : void {
	errorResponse(resp, undefined, 'Unknown API endpoint', { status: 404 });
}
