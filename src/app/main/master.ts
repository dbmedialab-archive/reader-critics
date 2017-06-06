import * as colors from 'ansicolors';
import * as cluster from 'cluster';

import printEnvironment from 'print-env';

import * as app from 'app/util/applib';

const log = app.createLog('master');

const workerMap = {};

/**
 * Main function of master process
 */
export default function() {
	log('Starting Reader Critics webservice');
	log('App located in %s', colors.brightWhite(app.rootPath));

	printEnvironment(app.createLog('env'));

	log(
		'%s threads available, running at %sx concurrency',
		colors.brightWhite(app.numThreads),
		colors.brightWhite(app.numConcurrency),
	);

	const startupPromises : Promise<{}> [] = [];

	for (let i = 0; i < app.numConcurrency; i++) {
		const worker : cluster.Worker = cluster.fork();
		log('Starting up worker %d', worker.id);

		startupPromises.push(new Promise((resolve) => {
			workerMap[worker.id] = {
				startupResolve: resolve,
			};
		}));
	}

	Promise.all(startupPromises).then(() => {
		log('All workers ready');
		notifyTestMaster();
	});
}

// Cluster Events

cluster.on('exit', (worker : cluster.Worker, code : number, signal : string) => {
	log('Worker %d died (%s)', worker.id, signal || code);
	delete workerMap[worker.id];
});

cluster.on('listening', (worker : cluster.Worker, address : any) => {
	log('Worker %d is ready', worker.id);
	workerMap[worker.id].startupResolve();
	workerMap[worker.id].startupResolve = undefined;  // Garbage collect this!
});

/**
 * Signal Test Environment
 */
function notifyTestMaster() : void {
	// If this is the test environment, there will be a master script waiting
	// for the app to start and become ready for API requests. Send a custom
	// "ready, proceed" signal to this process:
	if (app.isTest && process.env.MASTER_PID) {
		const masterPID = parseInt(process.env.MASTER_PID);
		if (masterPID > 0) {
			process.kill(masterPID, 'SIGUSR2');
		}
	}
}
