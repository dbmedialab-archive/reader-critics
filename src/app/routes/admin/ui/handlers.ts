//TO DO remove this test page
import * as doT from 'dot';
import * as path from 'path';
import * as passport from 'passport';

import { readFileSync } from 'fs';

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

// Template stuff
const styles: string[] = [
	'/static/admin.css',
];

const scripts: string[] = [
	'/static/react/react.js',
	'/static/react/react-dom.js',
	'/static/admin.bundle.js',
];

const mainTemplate = createTemplate();

function createTemplate() {
	const templatePath : string = path.join(app.rootPath, 'tmp/templates/admin.html');
	const templateRaw : string = readFileSync(templatePath).toString();

	return doT.template(templateRaw);
}

export function loginPageHandler(requ : Request, resp : Response) : void {
	resp.send(mainTemplate({
		styles,
		scripts,
	}));

	resp.status(200).end();
}

export function loginHandler(requ : Request, resp : Response, next : NextFunction) : void {
	log('enter loginHandler');
	const notAuth = (error) => errorResponse(resp, error, 'Not authorized', {
		status: 401,
	});

	const callback = (error, user) => {
		log('passport callback');
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

	log('passport.authenticate');
	passport.authenticate('local', callback)(requ, resp, next);
}

export function logoutHandler(requ : Request, resp : Response): void {
	requ.logOut();
	requ.session.destroy((err) => {  // "session" does not exist on type Request. What now?
		if (err) {
			log(err);
		}
		return loginPageHandler(requ, resp);
	});
}
