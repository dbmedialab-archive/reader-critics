//
// LESERKRITIKK v2 (aka Reader Critics)
// Copyright (C) 2017 DB Medialab/Aller Media AS, Oslo, Norway
// https://github.com/dbmedialab/reader-critics/
//
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with
// this program. If not, see <http://www.gnu.org/licenses/>.
//

import * as colors from 'ansicolors';
import * as cluster from 'cluster';
import * as express from 'express';
import * as http from 'http';

import { Express } from 'express';

import config from 'app/config';
import routes from 'app/routes';

import * as app from 'app/util/applib';

import { initDatabase } from 'app/db';
import { initLocalizationStrings } from 'app/services/localization';
import { initWebWorkerQueue } from 'app/queue';
import { signal } from './clusterSignals';

import {
	getAvailableParsers,
	initParserResolver,
} from 'app/services/parser/common/parserResolver';

import startupErrorHandler from './startupErrorHandler';

let log;
let expressApp : Express;
let httpPort;
let httpServer;

// Main function of worker process

export default function() {
	log = app.createLog('worker');
	log('Starting %s worker - ID %d', colors.brightGreen('web'), cluster.worker.id);

	// Create Express application
	expressApp = express();

	httpPort = config.get('http.port') || 4001;
	httpServer = http.createServer(expressApp);

	// Main application startup
	Promise.resolve()
		.then(initLocalizationStrings)
		.then(initDatabase)
		.then(initParserResolver)
		.then(printAvailableParsers)
		.then(initWebWorkerQueue)
		.then(startHTTP)
		.then(initExpress)
		.catch(startupErrorHandler)
		.then(signal.workerReady);
}

// HTTP server

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

// Additional startup functions

function printAvailableParsers() : Promise <void> {
	return getAvailableParsers().then(parsers => {
		log('Available parsers: %s', parsers.join(', '));
	});
}

// TODO Graceful shutdown
