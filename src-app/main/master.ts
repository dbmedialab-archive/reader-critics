import * as colors from 'ansicolors';
import * as cluster from 'cluster';

import printEnv from 'print-env';

import * as app from 'app/util/applib';

/**
 * Main function of master process
 */
export default function() {
	const log = app.createLog('master');

	log('Starting Reader Critics webservice');
	log('App located in %s', colors.brightWhite(app.rootPath));

	printEnvironment();

	log(
		'%s threads available, running at %sx concurrency',
		colors.brightWhite(app.numThreads),
		colors.brightWhite(app.numConcurrency),
	);

	for (let i = 0; i < app.numConcurrency; i++) {
		cluster.fork();
	}
}

function printEnvironment() {
	const log = app.createLog('env');
	printEnv(log);
}
