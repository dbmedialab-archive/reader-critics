import {
	Request,
	Response,
} from 'express';

import { okResponse } from './apiResponse';

import * as app from 'app/util/applib/logging';
const log = app.createLog();

export default function (requ: Request, resp: Response): void {
	const { username, email, comment } = requ.body;
	log('Received comment: %o', comment);
	okResponse(resp, { sent: true });
}
