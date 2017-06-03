import { Response } from 'express';
import { isObject } from 'lodash';

import * as app from 'app/util/applib';

// Response Options
export interface ResponseOptions {
	status? : number;
}

// Send a "success" response

export function okResponse(resp : Response, data? : any, options? : ResponseOptions) : void {
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
	error : Error,
	message? : string,
	options? : ResponseOptions,
) {
	const response : any = {
		success: false,
		error: error.message,
	};

	let statusCode = 500;

	if (options !== undefined) {
		Object.assign(response, options);

		if (options.status) {
			statusCode = options.status;
		}
	}

	if (message !== undefined) {
		response.message = message;
	}

	resp.status(statusCode).end(stringify(response));
}

// Return the response JSON. Pretty printed format in development mode, because
// humans read error messages, too!

function stringify (value : any) : string {
	return app.isProduction ? JSON.stringify(value) : JSON.stringify(value, null, 2) + '\n';
}
