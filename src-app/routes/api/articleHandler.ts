import {
	Request,
	Response,
} from 'express';

import ArticleURL from 'app/base/ArticleURL';

import { Article } from 'app/services';
import { EmptyError } from 'app/util/errors';

import {
	okResponse,
	errorResponse,
	ResponseOptions,
} from './apiResponse';

import * as app from 'app/util/applib';

const log = app.createLog();

// Main handler, checks for URL parameter and invalid requests

export default function(requ : Request, resp : Response) : void {
	try {
		const articleURL = new ArticleURL(requ.query.url);
		log('Requesting article at', articleURL.href);

		Article.getArticle(articleURL)
		.then(article => okResponse(resp, { article }))
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
