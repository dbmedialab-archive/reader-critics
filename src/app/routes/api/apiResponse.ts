import { Response } from 'express';
import { isObject } from 'lodash';

import * as app from 'app/util/applib';

const log = app.createLog('api');

// Response Options
export interface ResponseOptions {
	status? : number;
}

// Send a "success" response

export function okResponse(
	resp : Response,
	data? : any,
	options? : ResponseOptions
) : void {
	const response : any = {
		success: true,
	};

	if (isObject(data)) {
		Object.assign(response, { data });
	}

	let statusCode = 200;

	if (options !== undefined) {
		Object.assign(response, options);

		if (options.status) {
			statusCode = options.status;
		}
	}

	resp.status(statusCode).end(stringify(response));
}

// Send a "failure" response

export function errorResponse(
	resp : Response,
	error? : Error,
	message? : string,
	options? : ResponseOptions
) : void {
	const response : any = {
		success: false,
		message: (message !== undefined) ? message : 'Internal server error',
		status: 500,
	};

	if (error !== undefined) {
		response.error = error.message;
	}

	if (options !== undefined) {
		Object.assign(response, options, { success: false });
	}

	resp.status(response.status).end(stringify(response));

	if (response.status === 500) {
		log(error.stack || error);
	}
}

// Return the response JSON. Pretty printed format in development mode, because
// humans read error messages, too!

function stringify (value : any) : string {
	return app.isProduction ? JSON.stringify(value) : JSON.stringify(value, null, 2) + '\n';
}
