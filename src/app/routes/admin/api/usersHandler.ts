//TO DO remove this test handler

import {
	Request,
	Response,
} from 'express';

import {
	okResponse,
	errorResponse,
	ResponseOptions,
} from '../../api/apiResponse';
import * as app from 'app/util/applib';

const log = app.createLog();
import { EmptyError } from 'app/util/errors';
export default function(requ : Request, resp : Response) : void {
	try {
		log('Requesting article at', "");

		okResponse(resp, {});
	}
	catch (error) {
		const options = {
			status: 400,  // "Bad Request" in any case
		};

		if (error instanceof EmptyError) {
			errorResponse(resp, error, 'Mandatory URL parameter is missing or empty', options);
		}
		else {
			errorResponse(resp, error, 'URL parameter invalid', options);
		}
	}
}