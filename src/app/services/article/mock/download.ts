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

import * as path from 'path';
import * as app from 'app/util/applib';

import ArticleURL from 'base/ArticleURL';

import { NotFoundError } from 'app/util/errors';

const log = app.createLog();
const defaultName = 'resources/article/html/dagbladet.no_67732370.html';

// Check if the input URL matches the simple pattern
// http[s]://(hostname)/(article ID)
const rxSimple = /^https?:\/\/([^:\/\s]+)\/(.+\/)*(\d+)$/;

export default function(url : ArticleURL) : Promise <string> {
	const filename = determineFileName(url.href);

	if (filename === null) {
		return Promise.reject(new NotFoundError('Article not found'));
	}

	log('Mock article file name:', filename);

	return app.loadResource(filename)
	.then(buffer => buffer.toString('utf8'))
	.catch(error => Promise.reject(new NotFoundError('Article not found')));
}

function determineFileName(url : string) : string {
	const matches = url.match(rxSimple);

	if (!rxSimple.test(url) ? true : matches.length !== 4) {
		return null;
	}

	const hostname = matches[1].replace('www.', '');
	const articleID : number = parseInt(matches[3], 10);

	log('Try mock data from "%s" with article ID %d', hostname, articleID);
	return path.join('resources', 'article', 'html', `${hostname}_${articleID}.html`);
}
