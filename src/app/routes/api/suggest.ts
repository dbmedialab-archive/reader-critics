import {
	Request,
	Response,
} from 'express';

import { okResponse } from './apiResponse';

import * as app from 'app/util/applib';

const log = app.createLog();

export default function(requ : Request, resp : Response) : void {
	log('Received comment: %o', requ.body);
	okResponse(resp);
}
