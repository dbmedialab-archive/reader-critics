import {
	Request,
	Response,
	Router,
} from 'express';

import * as app from 'app/util/applib';
import * as doT from 'dot';
import * as path from 'path';
import { readFileSync } from 'fs';

const log = app.createLog();
const suggestionRoute : Router = Router();

suggestionRoute.get('/', suggestionHandler);
suggestionRoute.get('/*', notFoundHandler);

export default suggestionRoute;

// Template stuff
const templateName = 'tmp/templates/suggestion.html';
const styles = [
	'/static/styles/home.css',
];

const scripts = [];

const mainTemplate = createMainTemplate();

function suggestionHandler(requ : Request, resp : Response) {
	log('Homepage router', requ.params);
	resp.set('Content-Type', 'text/html');
	resp.send(mainTemplate({
		styles,
		scripts,
	}));

	resp.status(200).end();
}

// Everything else

function notFoundHandler(requ : Request, resp : Response) {
	log('404 not found');
	resp.status(404).end('not found');
}

function createMainTemplate() {
	// Currently loads the template from a static file.
	// The template will later be determined dynamically based on website url / domain.
	const templatePath = path.join(app.rootPath, templateName);
	const templateRaw = readFileSync(templatePath);

	return doT.template(templateRaw);
}
