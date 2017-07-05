import {
	Request,
	Response,
} from 'express';

import Article from 'base/Article';
import ArticleURL from 'base/ArticleURL';

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

		let wasFetched = false;

		const website = websiteService.identify(articleURL);

		if (website === undefined) {
			const msg = 'Could not identify website';
			return errorResponse(resp, new Error(msg), msg, {
				status: 400,
			});
		}

		log(articleURL.href);

		// Fetch the article from the database. If not stored, will return undefined
		articleService.load(articleURL, version)
		.then((article : Article) => {
			// Article is not in the database, fetch a fresh version from the web
			if (article === undefined) {
				wasFetched = true;
				return articleService.fetch(website, articleURL);
			}
			return article;
		})
		.then((article : Article) => {
			// Deliver the API response ...
			okResponse(resp, { article });
			return article;
		})
		.then((article : Article) => {
			// After serving the request: if the article is fresh, store it it
			// the database now
			if (!wasFetched) {
				return null;
			}

			return articleService.save(website, article);
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
		}
	}
}
