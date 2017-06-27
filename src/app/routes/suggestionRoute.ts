import {
	Request,
	Response,
	Router,
} from 'express';

import * as app from 'app/util/applib';
import * as doT from 'dot';
import * as path from 'path';
import { readFileSync } from 'fs';
import  notFoundHandler  from './notFoundHandler';

const log = app.createLog();
const suggestionRoute : Router = Router();

suggestionRoute.get('/', suggestionHandler);
suggestionRoute.get('/*', notFoundHandler);

export default suggestionRoute;

// Template stuff
const templateName = 'tmp/templates/suggestion.html';
const styles = [
	'/static/styles/home.css',
	'/static/styles/suggestion.css',
	'/static/front.css',
];

const scripts = [
	'/static/react/react.js',
	'/static/react/react-dom.js',
	'/static/front.bundle.js',
];

const mainTemplate = createMainTemplate();

function suggestionHandler(requ : Request, resp : Response) {
	log('Homepage router', requ.params);
	resp.set('Content-Type', 'text/html');
	resp.send(mainTemplate({
		feedbackParam: JSON.stringify({
			page: {
				title: 'Suggestion Box',
				version: '2017.05.11-something',
			},
			signed: 'NUdzNVJRdUdmTzd0ejFBWGwxS2tZRDVrRzBldTVnc0RDc2VheGdwego=',
		}),
		styles,
		scripts,
	}));

	resp.status(200).end();
}

function createMainTemplate() {
	// Currently loads the template from a static file.
	// The template will later be determined dynamically based on website url / domain.
	const templatePath = path.join(app.rootPath, templateName);
	const templateRaw = readFileSync(templatePath);

	return doT.template(templateRaw);
}
