import {
	Request,
	Response,
	Router,
} from 'express';

import * as app from 'app/util/applib';

import ArticleURL from 'base/ArticleURL';
import { EmptyError } from 'app/util/errors';

import emptyHandler from './feedback/emptyHandler';
import feedbackHandler from './feedback/feedbackHandler';
import paramErrorHandler from './feedback/paramErrorHandler';

const log = app.createLog();

// TODOs:
// - URL parsen und Hostnamen extrahieren (parser-package? warsch "url", Node API)
// - Hostnamen mit Datenbank abgleichen und Record des Kunden holen
// - Styling und Template laden
// - Templatecache für bereits geladene/kompilierte Frontends

// Prepare and export Express router

const feedbackRoute : Router = Router();

// The asterisk in the route means that anything after the / slash will be picked up by Express and
// exposed to the handler in Request.params[0]
// We use this to grab the article URL which is to be processed and that can be appended to this
// route without any further encoding. Most browsers are capable of that, also optional decoding
// will happen when an encoded URL is detected.
feedbackRoute.get('/*', mainHandler);

// TODO add "post" endpoint that can make use of additional query parameters, "version" most importantly

export default feedbackRoute;

// Main handler, checks the URL parameter and diverts to the respective handlers

function mainHandler(requ : Request, resp : Response) : void {
	try {
		const articleURL = new ArticleURL(requ.params[0]);
		log('Feedback main router to "%s"', articleURL);

		return feedbackHandler(requ, resp, articleURL);
	}
	catch (error) {
		if (error instanceof TypeError) {
			log('URL parameter invalid');
			return paramErrorHandler(requ, resp);
		}
		else if (error instanceof EmptyError) {
			log('Empty request without parameters');
			return emptyHandler(requ, resp);
		}
	}
}
