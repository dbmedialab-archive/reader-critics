//
// LESERKRITIKK v2 (aka Reader Critics)
// Copyright (C) 2017 DB Medialab/Aller Media AS, Oslo, Norway
// https://github.com/dbmedialab/reader-critics/
//
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with
// this program. If not, see <http://www.gnu.org/licenses/>.
//

import * as doT from 'dot';
import * as path from 'path';

import { readFileSync } from 'fs';

import {
	Request,
	Response,
} from 'express';

import * as app from 'app/util/applib';

import ArticleURL from 'base/ArticleURL';

const log = app.createLog();

const mainTemplate = createMainTemplate();

const styles = [
	'/static/fb.css',
];

const scripts = [
	'/static/react/react.js',
	'/static/react/react-dom.js',
	'/static/front.bundle.js',
];

// Respond with initial HTML, process template for feedback form page

export default function (requ : Request, resp : Response, articleURL : ArticleURL) {
	log('load article from', articleURL.href);

	resp.set('Content-Type', 'text/html')
	.send(mainTemplate({
		feedbackParam: JSON.stringify({
			article: {
				url: articleURL.href,
				version: '2017.05.11-something',
			},
			signed: 'NUdzNVJRdUdmTzd0ejFBWGwxS2tZRDVrRzBldTVnc0RDc2VheGdwego=',
		}),
		styles,
		scripts,
	}))
	.status(200)
	.end();
}

// Load main template
// TODO Process template on demand, based on article URL / customer website / domain
// Later: caching of already processed templates, maybe preload templates based on
// configured websites/domains.

function createMainTemplate() {
	// Currently loads the template from a static file.
	// The template will later be determined dynamically based on website url / domain.
	const templatePath : string = path.join(app.rootPath, 'tmp/templates/index.html');
	const templateRaw : string = readFileSync(templatePath).toString();

	return doT.template(templateRaw);
}
