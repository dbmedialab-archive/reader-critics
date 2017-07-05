import * as colors from 'ansicolors';
import * as cluster from 'cluster';
import * as Promise from 'bluebird';
import * as express from 'express';
import * as http from 'http';

import { Express } from 'express';

import config from 'app/config';
import routes from 'app/routes';

import * as app from 'app/util/applib';

import { initDatabase } from 'app/db';

let log;
let expressApp : Express;
let httpPort;
let httpServer;

/**
 * Main function of worker process
 */
export default function() {
	log = app.createLog('worker');
	log('Starting web worker %d', cluster.worker.id);

	// Create Express application
	expressApp = express();

	httpPort = config.get('http.port') || 4001;
	httpServer = http.createServer(expressApp);

	// Main application startup

	Promise.resolve()
		.then(initDatabase)
		.then(startHTTP)
		.then(initExpress)
		.catch(startupErrorHandler);
}

/**
 * Starting the HTTP server
 */
function startHTTP() {
	httpServer.on('error', startupErrorHandler);

	return new Promise((resolve) => {
		httpServer.listen(httpPort, () => {
			const p = colors.brightGreen(httpPort);
			const m = colors.brightCyan(app.env);
			log(`Reader Critics webservice running on port ${p} in ${m} mode`);
			return resolve();
		});
	});
}

function initExpress() {
	routes(expressApp);
	return Promise.resolve();  // Sync finish
}

// Error handling during startup

function startupErrorHandler(error : Error) {
	const typesThatDoNotPrintATrace = [
		'MongoError',
	];

	if (typesThatDoNotPrintATrace.includes(error.name)) {
		log('%s: %s', error.name, error.message);
	}
	else {
		log(error.stack || error.toString());
	}

	process.exit(-128);
}

// TODO Graceful shutdown
