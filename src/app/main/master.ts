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
		colors.brightWhite(app.numConcurrency),
	);

	const startupPromises : Promise <{}> [] = [];

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

// Check current NodeJS version against declaration in package.json

function checkEngineVersion() : Promise <void> {
	log('Checking NodeJS version');
	const pckgFilePath = path.join(app.rootPath, 'package.json');
	const pckgFile = readFileSync(pckgFilePath);
	const pckgConfig = JSON.parse(pckgFile.toString());

	if (semver.satisfies(process.version, pckgConfig.engines.node)) {
		return Promise.resolve();
	}

	return Promise.reject(new Error(
		`Current NodeJS version does not satisfy "${pckgConfig.engines.node}"`
	));
}

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
