import * as bluebird from 'bluebird';
import * as express from 'express';
import * as http from 'http';
import * as mysql from 'mysql';
import * as util from 'util';

import axios from 'axios';

import api from './apilib';
import config from './config';
import router from './routes';

global.Promise = bluebird;

const debug = api.createDebugChannel();

debug('Starting Kildekritikk API');

// Create Express application
const app = express();

const httpPort = config.get('http.port') || 4001;
const httpServer = http.createServer(app);

// Main application startup
Promise.resolve()  // This will be replaced by other initialization calls, e.g. database and such
.then(startHTTP)
.catch(error => console.error(error.stack));

app.use('/', router);

function startHTTP() {
	httpServer.listen(httpPort, () => {
		debug(`Reader Critics webservice running on port ${httpPort} in ${config.get('env')} mode`);
	});
}

