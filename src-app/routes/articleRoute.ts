import {
	Request,
	Response,
	Router
} from 'express';

import { isEmpty } from 'lodash';

import HtmlParser from 'app/parser/html/HtmlParser';

import * as app from 'app/util/applib';

//import feedbackHandler from './feedback/feedbackHandler';
//import emptyHandler from './feedback/emptyHandler';

const log = app.createLog();

// TODOs:
// - Router mit URL-Parameter einrichten
// - URL parsen und Hostnamen extrahieren (parser-package? warsch "url", Node API)
// - Hostnamen mit Datenbank abgleichen und Record des Kunden holen
// - Styling und Template laden
// - Templatecache für bereits geladene/kompilierte Frontends

// Prepare and export Express router

const router : Router = Router();

// The asterisk in the route means that anything after the / slash will be picked up by Express and
// exposed to the handler in Request.params[0]
// We use this to grab the article URL which is to be processed and that can be appended to this
// route without any further encoding. Most browsers are capable of that, also optional decoding
// will happen when an encoded URL is detected.
router.get('/get/*', getArticleHandler);

export default router;

// Main handler, checks for URL parameter and "empty" requests

function getArticleHandler(requ : Request, resp : Response) : void {
	const articleURL = requ.params[0];
	log('Fetch article "%s"', articleURL);

	const htmlParser = new HtmlParser(articleURL);

	htmlParser.getArticle()
	.then(article => resp.send(article))  // TODO api okResponse, vgl woodwing middleware
	.catch(reason => resp.status(500).send(reason));

	// if (articleURL.length <= 0) {
	// 	log('Empty request without parameters');
	// 	return emptyHandler(requ, resp);
	// }

	// return feedbackHandler(requ, resp, articleURL);
}
