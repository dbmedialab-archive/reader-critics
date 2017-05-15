import {
	Request,
	Response,
	Router
} from 'express';

import * as app from 'util/applib';

const log = app.createLog();

// TODOs:
// - Router mit URL-Parameter einrichten
// - URL parsen und Hostnamen extrahieren (parser-package? warsch "url", Node API)
// - Hostnamen mit Datenbank abgleichen und Record des Kunden holen
// - Styling und Template laden
// - Templatecache für bereits geladene/kompilierte Frontends

// Prepare and export Express router

const router = Router();
export default router;

router.get('/*', homeHandler);

// Main handler, checks for URL parameter and "empty" requests

function homeHandler(requ : Request, resp : Response) {
	log('Homepage router', requ.params);
	resp.json({
		status: 'show the project homepage here',
	}).status(200).end();
}
