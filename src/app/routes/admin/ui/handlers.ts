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
const styles = [
	'/static/styles/home.css',
	'/static/styles/suggestion.css',
	'/static/admin.css',
];

const scripts = [
	'/static/react/react.js',
	'/static/react/react-dom.js',
	'/static/admin.bundle.js',
];

const mainTemplate = createTemplate();

function createTemplate() {
	const templatePath = path.join(app.rootPath, 'tmp/templates/admin.html');
	const templateRaw = readFileSync(templatePath);

	return doT.template(templateRaw);
}

export function loginPageHandler(req : Request, res : Response) {
	log('Login Page router', req.params);
	res.send(mainTemplate({
		view: 'login',
		styles,
		scripts,
	}));

	res.status(200).end();
}

export function logoutHandler(req, res) {
	req.logOut();
	req.session.destroy(function(err){
		if (err){
			log(err);
		} else {
			res.redirect('login');
		}
	});
}

export function testPageHandler(req : Request, res : Response) {
	log('Test Page router', req.params);
	res.send(mainTemplate({
		view: 'testpage',
		styles,
		scripts,
	}));

	res.status(200).end();
}

export function loginHandler(req, res) {
	passport.authenticate('local', (err, user) => {
		if (err) {
			return res.redirect('login');
		}

		if (!user) {
			return res.redirect('login');
		}

		user = user.toString();

		req.logIn(user, (error) => {
			if (error) {
				return res.status(404).json('Authentication problems');
			}
			console.log('handler 94');
			console.log(req.user);
			res.redirect('/admin/testpage');
		});
	})(req, res);
}
