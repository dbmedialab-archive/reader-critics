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

import {
	Request,
	Response,
} from 'express';

import {
	InvalidRequestError,
	NotFoundError,
} from 'app/util/errors';

export function notFoundHandler(requ : Request, resp : Response) {
	send404Response(resp);
}

export function catchAllErrorHandler(
	err : Error,
	requ : Request,
	resp : Response,
	next : Function
) {
	if (err instanceof InvalidRequestError) {
		send400Response(resp, err.message);
	}
	if (err instanceof NotFoundError) {
		send404Response(resp, err.message);
	}
	else {
		resp.status(500).set('Content-Type', 'text/plain').send(err.stack);
	}
}

function send400Response(resp : Response, message? : string) {
	let template = badRequestPage;

	if (message) {
		template = template.replace('<h3></h3>', `<h3>${message}</h3>`);
	}

	resp.status(404).send(template);
}

function send404Response(resp : Response, message? : string) {
	let template = notFoundPage;

	if (message) {
		template = template.replace('<h3></h3>', `<h3>${message}</h3>`);
	}

	resp.status(404).send(template);
}

const badRequestPage = '<html>\
<head>\
	<title>Invalid Request</title>\
</head>\
<body>\
	<h1>Invalid Request</h1>\
	<h2>Parameters are missing or have invalid format</h2>\
	<h3></h3>\
</body>\
</html>';

const notFoundPage = '<html>\
<head>\
	<title>Not Found</title>\
</head>\
<body>\
	<h1>Not Found</h1>\
	<h3></h3>\
</body>\
</html>';
