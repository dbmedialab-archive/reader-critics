import {
	NextFunction,
	Request,
	Response,
} from 'express';

export default function (
	requ : Request,
	resp : Response,
	next: NextFunction
) : void | Response {
	if (requ.isAuthenticated()) {
		return next();
	}
	return resp.send(401);
}
