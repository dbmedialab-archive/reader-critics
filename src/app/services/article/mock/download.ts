import * as fs from 'fs';
import * as path from 'path';

import ArticleURL from 'base/ArticleURL';

import * as app from 'app/util/applib';

const log = app.createLog();

const defaultName = 'example.html';

// Check if the input URL matches the simple pattern
// http[s]://(hostname)/(article ID)
const rxSimple = /^https?:\/\/([^:\/\s]+)\/(\d+)$/;

export default function(url : ArticleURL) : Promise <string> {
	const filename = determineFileName(url.href);

	if (filename === undefined) {
		return Promise.resolve('<html></html>');
	}

	log(filename);
	return app.loadResource(filename).then(buffer => buffer.toString('utf8'));
}

function determineFileName(url : string) : string {
	if (!rxSimple.test(url)) {
		return defaultName;
	}

	const matches = url.match(rxSimple);

	if (matches.length !== 3) {
		return defaultName;
	}

	const hostname = matches[1].replace('www.', '');
	const articleID : number = parseInt(matches[2], 10);

	log('Loading mock data from "%s" with article ID %d', hostname, articleID);
	return path.join('resources', 'article', 'html', `${hostname}_${articleID}.html`);
}
