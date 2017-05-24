import {
	Request,
	Response,
} from 'express';

import ArticleURL from 'app/base/ArticleURL';

import { Article } from 'app/services';
import { EmptyError } from 'app/util/errors';

import * as app from 'app/util/applib';

const log = app.createLog();

// Main handler, checks for URL parameter and invalid requests
// getArticleHandler
export default function(requ : Request, resp : Response) : void {
	// TODO check for mandatory query parameters: "url" and "version"
	try {
		const articleURL = new ArticleURL(requ.params[0]);
		log('Requesting article at', articleURL.href);

		Article.getArticle(articleURL)
		.then(article => resp.json(article).status(200).end())
		.catch(error => resp.json(error).status(500).end());
		// TODO .catch with generic error response
	}
	catch (error) {
		const failCode = 400;  // "Bad Request" in any case

		if (error instanceof EmptyError) {
			resp.json({
				status: 'Mandatory URL parameter is missing',
			}).status(failCode).end();  // "Bad Request"
		}
		else {
			resp.json({
				status: 'URL parameter invalid',
			}).status(failCode).end();
		}
	}
}
