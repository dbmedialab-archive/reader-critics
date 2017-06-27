//TO DO remove this test page
import * as doT from 'dot';
import * as path from 'path';

import { readFileSync } from 'fs';

import {
	Request,
	Response,
} from 'express';

import * as app from 'app/util/applib';

const log = app.createLog();

const mainTemplate = createMainTemplate();

const styles = [
	'/static/admin.css',
];

const scripts = [
	'/static/react/react.js',
	'/static/react/react-dom.js',
	'/static/admin.bundle.js',
];

// Respond with initial HTML, process template for feedback form page

export default function (requ : Request, resp : Response) {
	log('admin test page loaded');

	resp.set('Content-Type', 'text/html')
		.send(mainTemplate({
		styles,
		scripts,
	}))
	.status(200)
	.end();
}


function createMainTemplate() {
	// Currently loads the template from a static file.
	// The template will later be determined dynamically based on website url / domain.
	const templatePath = path.join(app.rootPath, 'tmp/templates/admin.html');
	const templateRaw = readFileSync(templatePath);

	return doT.template(templateRaw);
}
