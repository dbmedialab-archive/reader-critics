import {
	Request,
	Response,
} from 'express';

import { okResponse } from './apiResponse';

import * as app from 'app/util/applib';

const log = app.createLog();

export default function(requ : Request, resp : Response) : void {
	// username, comment, email
	const { username, email, comment } = requ.body;
	console.log('suggest', username);
	log('Received comment: %o', requ.body);
	okResponse(resp);
}
