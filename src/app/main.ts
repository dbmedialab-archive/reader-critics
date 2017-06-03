import * as colors from 'ansicolors';
import * as Promise from 'bluebird';
import * as express from 'express';
import * as http from 'http';

import * as app from './util/applib';

import config from './config';
import routes from './routes';

import './env';

const log = app.createLog();

log('Starting Reader Critics webservice');
log('App located in %s', colors.brightWhite(app.rootPath));

// Create Express application

const expressApp = express();

const httpPort = config.get('http.port');
const httpServer = http.createServer(expressApp);

// Main application startup

Promise.resolve()
	.then(startHTTP)
	.then(initExpress)
	.then(notifyTestMaster)
	.catch(startupErrorHandler);

// Starting the HTTP server

function startHTTP() : Promise <any> {
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

function initExpress() : Promise <void> {
	routes(expressApp);
	return Promise.resolve();	// Sync finish
}

function notifyTestMaster() : Promise <void> {
	// If this is the test environment, there will be a master script waiting for the app to start
	// and become ready for API requests. Send a custom "ready, proceed" signal to this process:
	if (app.isTest && process.env.MASTER_PID) {
		const masterPID = parseInt(process.env.MASTER_PID);
		if (masterPID > 0) {
			process.kill(masterPID, 'SIGUSR2');
		}
	}
	return Promise.resolve();	// Sync finish
}

// Error handling during startup

function startupErrorHandler(error : Error) {
	log(error.stack || error.toString());
	process.exit(-128);
}

// TODO Graceful shutdown
