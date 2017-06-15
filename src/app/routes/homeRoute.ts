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

// TODOs:
// - Router mit URL-Parameter einrichten
// - URL parsen und Hostnamen extrahieren (parser-package? warsch "url", Node API)
// - Hostnamen mit Datenbank abgleichen und Record des Kunden holen
// - Styling und Template laden
// - Templatecache für bereits geladene/kompilierte Frontends

// Prepare and export Express router

const homeRoute : Router = Router();

homeRoute.get('/', homeHandler);
homeRoute.get('/*', notFoundHandler);

export default homeRoute;

const mainTemplate = createMainTemplate();

const styles = [
];

const scripts = [
	'/static/react/react.js',
	'/static/react/react-dom.js',
	'/static/front.bundle.js',
];

// Main handler, checks for URL parameter and "empty" requests

function homeHandler(requ : Request, resp : Response) {
	log('Homepage router', requ.params);
	resp.set('Content-Type', 'text/html');
	resp.send(mainTemplate({
		feedbackParam: JSON.stringify({
			signed: 'NUdzNVJRdUdmTzd0ejFBWGwxS2tZRDVrRzBldTVnc0RDc2VheGdwego=',
		}),
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
	const templatePath = path.join(app.rootPath, 'assets/templates/home.html');
	const templateRaw = readFileSync(templatePath);

	return doT.template(templateRaw);
}