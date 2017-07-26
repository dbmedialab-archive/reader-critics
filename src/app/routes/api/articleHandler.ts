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

import {
	Request,
	Response,
} from 'express';

import Article from 'base/Article';
import ArticleURL from 'base/ArticleURL';
import Website from 'base/Website';

import {
	articleService,
	websiteService,
} from 'app/services';

import { EmptyError } from 'app/util/errors';

import {
	errorResponse,
	okResponse,
	ResponseOptions,
} from './apiResponse';

import * as app from 'app/util/applib';

const log = app.createLog();

// Main handler, checks for URL parameter and invalid requests

export default function(requ : Request, resp : Response) : void {
	try {
		const articleURL = new ArticleURL(requ.query.url);
		const version = requ.query.version;

		let website : Website;
		let wasFetched = false;

		log(articleURL.href);

		// Fetch the article from the database. If not stored, will return null
		articleService.get(articleURL, version)
		.then((article : Article) => {
			if (article !== null) {
				return article;
			}

			// Article is not in the database, fetch a fresh version from the web
			wasFetched = true;

			return websiteService.identify(articleURL).then((w : Website) => {
				if (website === null) {
					return Promise.reject(new Error('Could not identify website'));
				}

				website = w;
				return articleService.fetch(website, articleURL);
			});
		})
		// Deliver the API response ...
		.then((article : Article) => {
			okResponse(resp, { article });
			return article;
		})
		// After serving the request: if the article is just fetched, store it in
		// the database now
		.then((article : Article) => {
			return wasFetched ? articleService.save(website, article).catch(error => log) : null;
		})
		.catch(error => errorResponse(resp, error));
	}
	catch (error) {
		const options : ResponseOptions = {
			status: 400,  // "Bad Request" in any case
		};

		if (error instanceof EmptyError) {
			errorResponse(resp, error, 'Mandatory URL parameter is missing or empty', options);
		}
		else {
			errorResponse(resp, error, 'URL parameter invalid', options);
			log(error.stack);
		}
	}
}
