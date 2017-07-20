import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';

import {
	NextFunction,
	Request,
	Response,
} from 'express';

import config from 'app/config';

const jwtSession = config.get('auth.jwt.session');

export default function (
	requ : Request,
	resp : Response,
	next: NextFunction
) : void {
	if (requ.isAuthenticated()) {
		return next();
	}
	else {
		return passport.authenticate('jwt', jwtSession)(requ, resp, next);
	}
}
