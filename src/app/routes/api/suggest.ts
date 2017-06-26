import {
	Request,
	Response,
} from 'express';

import { okResponse } from './apiResponse';

import { createLog } from 'app/util/applib/logging';

export default function (requ: Request, resp: Response): void {
	const { username, email, comment } = requ.body;
	createLog('suggest');
	okResponse(resp, { sent: true });
}
