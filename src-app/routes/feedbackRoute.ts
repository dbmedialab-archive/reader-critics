import {
	Request,
	Response,
	Router
} from 'express';

import feedbackHandler from './feedback/feedbackHandler';
import emptyHandler from './feedback/emptyHandler';

import * as app from 'applib';

const log = app.createLog();

// TODOs:
// - Router mit URL-Parameter einrichten
// - URL parsen und Hostnamen extrahieren (parser-package? warsch "url", Node API)
// - Hostnamen mit Datenbank abgleichen und Record des Kunden holen
// - Styling und Template laden
// - Templatecache für bereits geladene/kompilierte Frontends

// Prepare and export Express router

const router = Router();

router.get('/*', mainHandler);

export default router;

// Main handler, checks for URL parameter and "empty" requests

function mainHandler(requ : Request, resp : Response) {
	const articleURL = requ.params[0] || '';
	// TODO add flexibility and do URL decode (maybe check via regex if '%[hex]' appears, then convert)
	log('Feedback main router', requ.params);

	if (articleURL.length <= 0) {
		log('Empty request without parameters');
		return emptyHandler(requ, resp);
	}

	return feedbackHandler(requ, resp, articleURL);
}
