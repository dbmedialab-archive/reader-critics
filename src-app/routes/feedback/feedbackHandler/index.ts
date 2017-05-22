import * as doT from 'dot';
import * as path from 'path';

import { readFileSync } from 'fs';

import {
	Request,
	Response,
} from 'express';

import * as app from 'app/util/applib';

import ArticleURL from 'app/base/ArticleURL';

const log = app.createLog();

const mainTemplate = createMainTemplate();

const styles = [
	'feedback.css',
];

const scripts = [
	'react/react.js',
	'react/react-dom.js',
	'bundle.js',
];

// Respond with initial HTML, process template for feedback form page

export default function (requ : Request, resp : Response, articleURL : ArticleURL) {
	log('feedback endpoint');
	log(`[${articleURL.href}]`);

	// 2. Use template function as many times as you like
	//const resultText = indexTemplate({foo: articleURL});
	//resp.json({ and_now: resultText }).status(200).end();

	resp.set('Content-Type', 'text/html');
	resp.send(mainTemplate({
		articleURL: articleURL.href,
		styles,
		scripts,
	}));

	resp.status(200).end();
}

// Load main template
// TODO Process template on demand, based on article URL / customer website / domain
// Later: caching of already processed templates, maybe preload templates based on
// configured websites/domains.

function createMainTemplate() {
	// Currently loads the template from a static file.
	// The template will later be determined dynamically based on website url / domain.
	const templatePath = path.join(app.rootPath, 'tmp/templates/index.html');
	const templateRaw = readFileSync(templatePath);

	return doT.template(templateRaw);
}
