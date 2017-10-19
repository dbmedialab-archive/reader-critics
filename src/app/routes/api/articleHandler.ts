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
	localizationService,
	websiteService,
} from 'app/services';

import { EmptyError, NotFoundError } from 'app/util/errors';

import {
	errorResponse,
	okResponse,
	ResponseOptions,
} from './apiResponse';

import * as app from 'app/util/applib';

const log = app.createLog();
const __ = localizationService.translate;

// Main handler, checks for URL parameter and invalid requests

export default function(requ : Request, resp : Response) : void {
	let articleURL : ArticleURL;
	let website : Website;
	let article : Article;

	let version : string = requ.query.version || null;

	// 1 - Article URL and Website identification
	ArticleURL.from(requ.query.url).then((url : ArticleURL) => {
		articleURL = url;
		log(url.toString());
		return websiteService.identify(articleURL);
	})

	// 2 - Query versioned article directly from our database
	.then((w : Website) => {
		if (w === null) {
			log('not identified');
			return Promise.reject(new Error(__('err.no-website-identify')));
		}

		website = w;

		// Check if there is a version parameter and if yes, query the database
		// for this article version. If no version was requested, trigger a fetch
		// by returning <null> and get the latest version from the web.

		if (version) {
			return articleService.get(articleURL, version);
		}

		log('No article version in request, fallback to fetch latest');
		return null;
	})

	// 3 - Fetch stage (if no database hit or no version parameter in request)
	.then((a : Article) => {
		return (a !== null) ? a : articleService.fetch(website, articleURL);
	})

	// 4 - Deliver the API response
	.then((a : Article) => {
		article = a;
		version = article.version;
		okResponse(resp, { article });
	})

	// 5 - Save article to the database after serving the request
	// If the article has just been fetched, store it in the database now. This
	// step is done after delivering the response to the client to save the RTT
	// to the database in the response time.
	.then(() => articleService.exists(articleURL, version))
	.then((exists : boolean) => {
		if (!exists) {
			return articleService.upsert(website, article)
			.catch(error => log(error));
		}
	})
	.catch(error => {
		if (error instanceof NotFoundError) {
			return errorResponse(resp, error);
		}

		const options : ResponseOptions = {
			status: 400,
		};

		if (error instanceof EmptyError) {
			errorResponse(resp, error, __('err.no-url-param'), options);
		}
		else {
			// Whatever passes down until here is probably a 500 internal server terror
			errorResponse(resp, error);
			log(error.stack);
		}
	});
}
