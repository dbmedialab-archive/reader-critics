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

// tslint:disable no-require-imports

import * as cluster from 'cluster';
import * as Bluebird from 'bluebird';

global.Promise = Bluebird;

export const typeJobWorker = 'job-worker';
export const typeWebWorker = 'web-worker';

declare function require(arg : string) : any;

if (cluster.isMaster) {
	require('./main/master').default();
}
else {
	switch (process.env.WORKER_TYPE) {
		case typeJobWorker:
			require('./main/jobWorker').default();
			break;
		case typeWebWorker:
			require('./main/webWorker').default();
			break;
		default:
			console.log(`Invalid worker type "${process.env.WORKER_TYPE}", exiting`);
			process.exit(-129);
	}
}
