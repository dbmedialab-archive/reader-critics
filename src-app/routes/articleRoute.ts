import {
	Request,
	Response,
	Router,
} from 'express';

import * as app from 'app/util/applib';

import ArticleURL from 'app/base/ArticleURL';

import { Article } from 'app/services';
import { EmptyError } from 'app/util/errors';

const log = app.createLog();

// Prepare and export Express router

const router : Router = Router();

// TODO in order to get "version" into this endpoint, change to contain two (or more) query parameters
router.get('/get/*', getArticleHandler);

export default router;

// Main handler, checks for URL parameter and invalid requests

function getArticleHandler(requ : Request, resp : Response) : void {
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

/*
	const articleURL = requ.params[0];
	log('Fetch article "%s"', articleURL);

*/
	// if (articleURL.length <= 0) {
	// 	log('Empty request without parameters');
	// 	return emptyHandler(requ, resp);
	// }

	// return feedbackHandler(requ, resp, articleURL);
