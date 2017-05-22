import {
	Request,
	Response,
	Router
} from 'express';

import { isEmpty } from 'lodash';

import * as app from 'app/util/applib';

import ArticleURL from 'app/base/ArticleURL';

import { EmptyError } from 'app/util/errors';

const log = app.createLog();

// Prepare and export Express router

const router : Router = Router();

router.get('/get/*', getArticleHandler);

export default router;

// Main handler, checks for URL parameter and invalid requests

function getArticleHandler(requ : Request, resp : Response) : void {
	try {
		const articleURL = new ArticleURL(requ.params[0]);
		log('Requesting article at', articleURL.href);

		resp.json({
			status: 'ok',
		}).status(200).end();
	}
	catch (error) {
		if (error instanceof TypeError) {
			resp.json({
				status: 'URL parameter invalid',
			}).status(400).end();  // "Bad Request"
		}
		else if (error instanceof EmptyError) {
			resp.json({
				status: 'Mandatory URL parameter is missing',
			}).status(400).end();  // "Bad Request"
		}
	}
}

/*
	const articleURL = requ.params[0];
	log('Fetch article "%s"', articleURL);

	const htmlParser = new HtmlParser(articleURL);

	htmlParser.getArticle()
	.then(article => resp.send(article))  // TODO api okResponse, vgl woodwing middleware
	.catch(reason => resp.status(500).send(reason));
*/
	// if (articleURL.length <= 0) {
	// 	log('Empty request without parameters');
	// 	return emptyHandler(requ, resp);
	// }

	// return feedbackHandler(requ, resp, articleURL);
