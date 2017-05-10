import * as bluebird from 'bluebird';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as util from 'util';

import axios from 'axios';

import * as app from 'applib';

import logRequest from './app/logRequest';
import faviconRoute from './routes/faviconRoute';
import feedbackRoute from './routes/feedbackRoute';

import config from './config';
import router from './routes';

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

// We don't bundle frontend libraries together with the compiled sources, but rather host
// them from static endpoints. Fair tradeoff between enabled browser caching but not using
// a CDN for those libs and being able to upgrade them easily through NPM or Yarn locally.
expressApp.use('/static/react', express.static(path.join(app.rootPath, 'node_modules/react/dist/')));
expressApp.use('/static/react', express.static(path.join(app.rootPath, 'node_modules/react-dom/dist/')));

expressApp.use('/static', express.static(path.join(app.rootPath, 'out/front')));

expressApp.use('/fb', feedbackRoute);

expressApp.use('/', router);

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
