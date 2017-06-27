import {
	Request,
	Response,
} from 'express';
import * as app from 'app/util/applib';
const log = app.createLog();
/**
 * @param request
 * @param res
 */
export default function (request : Request, res : Response) {
	log('404 not found');
	res.status(404).end('Not what you\'re looking fo');
}
