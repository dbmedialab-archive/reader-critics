import * as os from 'os';

import { isNil } from 'lodash';

/**
 * The maximum number of threads/processor cores (depends on SMT) on this machine.
 */
export const numThreads : number = os.cpus().length;

/**
 * The desired cluster concurrency. If the environment variable WEB_CONCURRENCY is defined and its
 * value is between 1 and the number of available CPUs, this number is taken.
 * The number of CPUs is the hard maximum for concurrency, so values in WEB_CONCURRENCY greater than
 * the processor thread count are capped.
 * At least one master-worker couple will be spawned to handle interprocess messages and events.
 */
export const numConcurrency : number = (function() {
	if (!isNil(process.env.WEB_CONCURRENCY)) {
		const webConcur = parseInt(process.env.WEB_CONCURRENCY);
		if (Number.isSafeInteger(webConcur) && webConcur > 0 && webConcur < numThreads) {
			return webConcur;
		}
	}

	return numThreads;
})();
