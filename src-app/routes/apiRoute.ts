import {
	Request,
	Response,
	Router,
} from 'express';

import articleHandler from './api/articleHandler';

import * as app from 'app/util/applib';

const log = app.createLog();

// Prepare and export Express router

const router : Router = Router();

router.get('/article/*', articleHandler);

router.get('/*', defaultHandler);

export default router;

function defaultHandler(requ : Request, resp : Response) : void {
	log('Default API router');
	resp.status(404).end('Unknown API endpoint');
}
