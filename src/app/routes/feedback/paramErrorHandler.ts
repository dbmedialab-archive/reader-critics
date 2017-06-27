import {
	Request,
	Response,
} from 'express';

/**
 * Render a page that displays a parameter parser error.
 */

export default function (requ : Request, resp : Response) {
	// TODO external fn: parse referrer URL to determine style env
	resp.json({
		status: 'Wrong URL, show error page',
	}).status(404).end();
}
