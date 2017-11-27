//
// LESERKRITIKK v2 (aka Reader Critics)
// Copyright (C) 2017 DB Medialab/Aller Media AS, Oslo, Norway
// https://github.com/dbmedialab/reader-critics/
//
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with
// this program. If not, see <http://www.gnu.org/licenses/>.
//

import { Response } from 'express';

import * as app from 'app/util/applib';

import {
	NotFoundError,
	SchemaValidationError,
} from 'app/util/errors';

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

	response.data = data || {};

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
		message: (message !== undefined) ? message : (
			(error !== undefined) ? error.message : 'Internal server error'
		),
	};

	if (error instanceof NotFoundError) {
		response.status = 404;
	}
	else if (error instanceof SchemaValidationError) {
		response.status = 400;
	}
	else {
		response.status = 500;
	}

	if (error !== undefined) {
		response.error = error.message;
	}

	if (options !== undefined) {
		Object.assign(response, options, { success: false });
	}
	resp.status(response.status).send(stringify(response));

	if (response.status === 500) {
		log(error.stack || error);
	}
}

// Return the response JSON. Pretty printed format in development mode, because
// humans read error messages, too!

function stringify (value : any) : string {
	return app.isProduction ? JSON.stringify(value) : JSON.stringify(value, null, 2) + '\n';
}

/*
 * Responds with collection of entities
 * if empty - will respond with 404
 * JSON format
 */
export function bulkResponse (resp, collection) {
	const notFound = 'Resource not found';
	if (collection.length > 0) {
		okResponse(resp, collection);
	} else {
		errorResponse(resp, undefined, notFound, { status: 404 });
	}
}

