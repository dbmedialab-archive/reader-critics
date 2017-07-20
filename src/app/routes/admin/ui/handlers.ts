//TO DO remove this test page
import * as doT from 'dot';
import * as path from 'path';
import * as passport from 'passport';

import { readFileSync } from 'fs';

import {
	Request,
	Response,
} from 'express';

import * as app from 'app/util/applib';

const log = app.createLog();

// Template stuff
const styles: string[] = [
	'/static/styles/home.css',
	'/static/styles/suggestion.css',
	'/static/admin.css',
];

const scripts: string[] = [
	'/static/react/react.js',
	'/static/react/react-dom.js',
	'/static/admin.bundle.js',
];

const mainTemplate = createTemplate();

function createTemplate() {
	const templatePath: string = path.join(app.rootPath, 'tmp/templates/admin.html');
	const templateRaw: Buffer = readFileSync(templatePath);

	return doT.template(templateRaw);
}

export function loginPageHandler(req : Request, res : Response): void {
	res.send(mainTemplate({
		view: 'login',
		styles,
		scripts,
	}));

	res.status(200).end();
}

export function loginHandler(req, res, next): void {
	passport.authenticate('local', (error, token, user) => {
		if (error) {
			return res.status(401).json({error});
		}

		if (!user) {
			return res.status(401).json({error: 'User not found'});
		}

		req.logIn(user, (err) => {
			if (err) {
				return res.status(401).json({error: err});
			}
			return res.status(200).json({error: false, status: 'ok', user, token});
		});
	})(req, res, next);
}

export function logoutHandler(req, res): void {
	req.logOut();
	req.session.destroy(function(err){
		if (err){
			log(err);
		} else {
			res.redirect('login');
		}
	});
}

// TODO remove test handler
export function testPageHandler(req : Request, res : Response): void {
	res.send(mainTemplate({
		view: 'testpage',
		styles,
		scripts,
	}));

	res.status(200).end();
}
