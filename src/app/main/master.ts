import * as colors from 'ansicolors';
import * as cluster from 'cluster';
import * as path from 'path';
import * as semver from 'semver';

import { readFileSync } from 'fs';

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
		colors.brightWhite(app.numConcurrency)
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

	function allWorkersStartedPromise() : Promise <void> {
		return new Promise((resolve)=>{
			Promise.all(startupPromises).then(()=>{
				resolve();
			});
		});
	}
	checkEngineVersion()
		.then(allWorkersStartedPromise)
		.then(notifyTestMaster)
		.catch(startupErrorHandler);
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

// Error handling during startup

function startupErrorHandler(error : Error) {
	log(error.stack || error.toString());
	process.exit(-128);
}

// Signal Test Environment

function notifyTestMaster() : Promise <void> {
	log('All workers ready');
	// If this is the test environment, there will be a master script waiting
	// for the app to start and become ready for API requests. Send a custom
	// "ready, proceed" signal to this process:
	if (app.isTest && process.env.MASTER_PID) {
		const masterPID = parseInt(process.env.MASTER_PID);
		if (masterPID > 0) {
			process.kill(masterPID, 'SIGUSR2');
		}
	}

	// Sync resolve
	return Promise.resolve();
}

function checkEngineVersion(): Promise<any> {
	log('Check NodeJS version');
	const pckgFilePath = path.join(app.rootPath, 'package.json');
	const pckgFile = readFileSync(pckgFilePath);
	const pckgConfig = JSON.parse(pckgFile.toString());
	return new Promise((resolve, reject) => {
		if (semver.gte(process.version, pckgConfig.engines.node)) {
			resolve();
		} else {
			throw new Error('Version of NodeJS is less than ' + pckgConfig.engines.node);
		}
	});
}
