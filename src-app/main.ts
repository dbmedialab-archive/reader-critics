import * as colors from 'ansicolors';
import * as Promise from 'bluebird';
import * as express from 'express';
import * as http from 'http';

import * as app from './util/applib';

import config from './config';
import logRequest from './util/logRequest';

import routes from './routes';

import './env';

const log = app.createLog();

log('Starting Reader Critics webservice');
log('App located in %s', colors.brightWhite(app.rootPath));

// Create Express application

const expressApp = express();

const httpPort = config.get('http.port') || 4001;
const httpServer = http.createServer(expressApp);

// Main application startup

Promise.resolve()  // This will be replaced by other initialization calls, e.g. database and such
	.then(startHTTP)
	.then(initExpress)
	.catch(startupErrorHandler);

// Starting the HTTP server

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
	log(error.stack || error.toString());
	process.exit(-128);
}

// TODO Graceful shutdown
