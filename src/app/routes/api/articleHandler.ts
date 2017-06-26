import {
	Request,
	Response,
} from 'express';

import Article from 'base/Article';
import ArticleURL from 'base/ArticleURL';

import { articleService } from 'app/services';
import { EmptyError } from 'app/util/errors';

import {
	okResponse,
	errorResponse,
	ResponseOptions,
} from './apiResponse';

import { createLog } from 'app/util/applib/logging';

// Main handler, checks for URL parameter and invalid requests

export default function (requ: Request, resp: Response): void {
	try {
		const articleURL = new ArticleURL(requ.query.url);
		createLog('Requesting article at');

		articleService.getArticle(articleURL)
			.then((article: Article) => okResponse(resp, { article }))
			.catch(error => errorResponse(resp, error));
	}
	catch (error) {
		const options: ResponseOptions = {
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