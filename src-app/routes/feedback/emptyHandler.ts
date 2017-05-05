import {
	Request,
	Response,
} from 'express';

/**
 * Render a page that displays information about the mandatory URL parameter being missing.
 */

export default function (requ : Request, resp : Response) {
	// TODO external fn: parse referrer URL to determine style env
	resp.json({
		status: 'empty response, no URL',
	}).status(302).end();
}
