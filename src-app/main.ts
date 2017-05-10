import 'app-module-path/register';

import * as bluebird from 'bluebird';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as util from 'util';

import axios from 'axios';

import config from './config';
import * as app from 'util/applib';

import logRequest from 'util/logRequest';

import faviconRoute from 'routes/faviconRoute';
import feedbackRoute from 'routes/feedbackRoute';
import homeRoute from 'routes/homeRoute';
import staticRoute from 'routes/staticRoute';

global.Promise = bluebird;

const log = app.createLog();
log('Starting Reader Critics webservice');

// Create Express application

const expressApp = express();

expressApp.use(logRequest);

const httpPort = config.get('http.port') || 4001;
const httpServer = http.createServer(expressApp);

// Main application startup

Promise.resolve()  // This will be replaced by other initialization calls, e.g. database and such
	.then(startHTTP)
	.catch(startupErrorHandler);

expressApp.use(faviconRoute);
expressApp.use('/static', staticRoute);
expressApp.use('/fb', feedbackRoute);
expressApp.use('/', homeRoute);

// Starting the HTTP server

function startHTTP() {
	httpServer.on('error', startupErrorHandler);

	return new Promise((resolve) => {
		httpServer.listen(httpPort, () => {
			log(`Reader Critics webservice running on port ${httpPort} in ${app.env} mode`);
			return resolve();
		});
	});
}

// Error handling during startup

function startupErrorHandler(error : Error) {
	log(error.stack || error.toString());
	process.exit(-128);
}

// TODO Graceful shutdown
