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
import * as kue from 'kue';

import * as app from 'app/util/applib';

import { initDatabase } from 'app/db';
import { initMessageQueue } from 'app/queue';

import startupErrorHandler from './startupErrorHandler';

let log;

/**
 * Main function of worker process
 */
export default function() {
	log = app.createLog('worker');
	log('Starting %s worker - ID %d', colors.brightYellow('job'), cluster.worker.id);

	// Main application startup

	const jobReceiver = {
		onNewFeedback : (job : kue.Job, done : kue.DoneCallback) => {
			log('New feedback in queue!', job.data);
			done();
		},
	};

	Promise.resolve()
		.then(initDatabase)
		.then(() => initMessageQueue(jobReceiver))
		.catch(startupErrorHandler);
}
