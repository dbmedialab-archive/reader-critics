import 'app-module-path/register';

import * as colors from 'ansicolors';
import * as Promise from 'bluebird';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as util from 'util';

import * as app from './util/applib';

import config from './config';
import logRequest from './util/logRequest';

import articleRoute from './routes/articleRoute';
import faviconRoute from './routes/faviconRoute';
import feedbackRoute from './routes/feedbackRoute';
import homeRoute from './routes/homeRoute';
import staticRoute from './routes/staticRoute';

import './env';

// global.Promise = bluebird;

const log = app.createLog();

log('Starting Reader Critics webservice');
log('App located in %s', colors.brightWhite(app.rootPath));

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
expressApp.use('/article', articleRoute);

expressApp.use('/', homeRoute);

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

// Error handling during startup

function startupErrorHandler(error : Error) {
	log(error.stack || error.toString());
	process.exit(-128);
}

// TODO Graceful shutdown
