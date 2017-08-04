import * as colors from 'ansicolors';
import * as cluster from 'cluster';

import * as app from 'app/util/applib';

import { initDatabase } from 'app/db';

import startupErrorHandler from './startupErrorHandler';

let log;

/**
 * Main function of worker process
 */
export default function() {
	log = app.createLog('worker');
	log('Starting %s worker - ID %d', colors.brightYellow('job'), cluster.worker.id);

	// Main application startup

	Promise.resolve()
		.then(initDatabase)
		.catch(startupErrorHandler);
}
