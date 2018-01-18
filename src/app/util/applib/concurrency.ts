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

import * as os from 'os';

import { isNil } from 'lodash';

/**
 * The maximum number of threads/processor cores (depends on SMT) on this machine.
 */
export const numThreads : number = os.cpus().length;

/**
 * The desired cluster concurrency. If the environment variable WEB_CONCURRENCY
 * is defined and its value is between 1 and the number of available CPUs, this
 * number is taken as base value.
 * The calculated concurrency number + 1 is taken for the end result. A small
 * share of the available cores will be occupied by job workers while the
 * majority of threads will spawn web workers.
 * The number of available CPU cores is the maximum for concurrency, so values
 * in WEB_CONCURRENCY greater than the processor thread count are capped.
 * At least one master-webworker-jobworker couple will be spawned to handle
 * interprocess messages and queue events.
 * No export because this is only used for calculations.
 */
const numConcurrency : number = (function() {
	if (!isNil(process.env.WEB_CONCURRENCY)) {
		const webConcur = parseInt(process.env.WEB_CONCURRENCY);
		if (Number.isSafeInteger(webConcur) && webConcur > 0 && webConcur < numThreads) {
			return webConcur;
		}
	}

	return numThreads;
})();

/**
 * The concurrency weight will determine how many threads of which worker type
 * will be created. There will always be at least one job worker.
 */
const concurrencyWeight : number = 0.21;

/**
 * Don't be afraid. This is serious math ;-)
*/
export const numJobWorkers = Math.ceil(
	(numConcurrency + 1) * (concurrencyWeight - (0.01 * (1 / numConcurrency)))
);

export const numWebWorkers = (numConcurrency + 1) - numJobWorkers;
