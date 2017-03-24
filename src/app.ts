import * as bluebird from 'bluebird';
import * as express from 'express';
import * as http from 'http';
import * as mysql from 'mysql';
import * as path from 'path';
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

// Main application startup
// Promise.resolve()  // This will be replaced by other initialization calls, e.g. database and such
// 	.then(startHTTP)
// 	.catch(error => console.error(error.stack));

app.use('/static', express.static(path.join(__dirname, 'frontend', 'dist')));
app.use('/static', express.static(path.join(__dirname, 'frontend', 'assets')));

app.use('/', router);

app.listen(3000, () => console.log('Runs on port 3000'));

// function startHTTP() {
// 	httpServer.listen(httpPort, () => {
// 		debug(`Reader Critic API running on port ${httpPort} in ${config.get('env')} mode`);
// 	});
// }
