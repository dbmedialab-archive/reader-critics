import * as passport from 'passport';

import {
	NextFunction,
	Request,
	Response,
} from 'express';

import {
	errorResponse,
	okResponse,
} from 'app/routes/api/apiResponse';

import * as app from 'app/util/applib';

const log = app.createLog();

export function loginHandler(requ : Request, resp : Response, next : NextFunction) : void {
	const notAuth = (error) => errorResponse(resp, error, 'Not authorized', {
		status: 401,
	});

	const callback = (error, user) => {
		if (error || user === false) {
			return notAuth(error || new Error('Invalid credentials'));
		}

		requ.logIn(user, (loginErr) => {
			if (loginErr) {
				return notAuth(loginErr);
			}

			okResponse(resp, user);
		});
	};

	passport.authenticate('local', callback)(requ, resp, next);
}

export function logoutHandler(requ : Request, resp : Response): void {
	requ.logOut();
	requ.session.destroy((err) => {  // "session" does not exist on type Request. What now?
		if (err) {
			log(err);
		}
		return resp.redirect('/'); //Returns to site's homepage
	});
}
