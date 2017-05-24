import {
	Request,
	Response,
	Router,
} from 'express';

import * as app from 'app/util/applib';

const log = app.createLog();

// TODOs:
// - Router mit URL-Parameter einrichten
// - URL parsen und Hostnamen extrahieren (parser-package? warsch "url", Node API)
// - Hostnamen mit Datenbank abgleichen und Record des Kunden holen
// - Styling und Template laden
// - Templatecache für bereits geladene/kompilierte Frontends

// Prepare and export Express router

const router : Router = Router();

router.get('/', homeHandler);
router.get('/*', notFoundHandler);

export default router;

// Main handler, checks for URL parameter and "empty" requests

function homeHandler(requ : Request, resp : Response) {
	log('Homepage router', requ.params);
	resp.json({
		status: 'show the project homepage here',
	}).status(200).end();
}

// Everything else

function notFoundHandler(requ : Request, resp : Response) {
	log('404 not found');
	resp.status(404).end('not found');
}
