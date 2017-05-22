import {
	Request,
	Response,
	Router
} from 'express';

import * as app from 'app/util/applib';

import { Article } from 'app/services';

import feedbackHandler from './feedback/feedbackHandler';
import emptyHandler from './feedback/emptyHandler';

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
router.get('/*', mainHandler);

export default router;

// Main handler, checks for URL parameter and "empty" requests

function mainHandler(requ : Request, resp : Response) : void {
	const articleURL = Article.parseURL(requ.params[0]);
	log('Feedback main router to "%s"', articleURL);

	if (articleURL.length <= 0) {
		log('Empty request without parameters');
		return emptyHandler(requ, resp);
	}

	return feedbackHandler(requ, resp, articleURL);
}
