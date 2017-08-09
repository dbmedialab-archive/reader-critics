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
