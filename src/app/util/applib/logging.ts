import * as callsite from 'callsite';
import * as cluster from 'cluster';
import * as debug from 'debug';

import { isObject } from 'lodash';

/** First component of debug's logger */
export const appName = 'app';  // As short as possible, please

const regexFileSuffix = /\.[a-z]+?$/;
const regexDeleteIndex = /\/index$/;
const regexForwardSlashes = /\//g;
const regexEnvSuffix = /\.(:?live|mock)$/;

/**
 * Dynamically create a log channel based on the caller location.
 * @return function (...args : any[]) => void
 */
export function createLog(moduleName? : string) : (...args : any[]) => void {
	const processID = getProcessID();
	const name = moduleName !== undefined ? moduleName : logChannelName (callsite());

	return debug(`${appName}${processID}:${name}`);
}

/**
 * Creates a log channel name from a callstack.
 * @return string
 */
const logChannelName = (callstack: callsite.CallSite[]) : string => {
	if (!isCallTrace(callstack)) {
		return appName;
	}

	// Get second item of the call stack, this points back to the place where
	// "createLog" is invoked. Then replace several things in the file path
	// to create a log channel name in "debug" syntax.
	const originName = callstack[1].getFileName()
		.replace(regexFileSuffix, '')  // strip file suffix
		.replace(regexDeleteIndex, '')  // strip "index"
		.replace(regexForwardSlashes, ':')  // replace slashes with colons
		.replace(regexEnvSuffix, '');  // string environment suffixes from service modules etc.

	// Replace "app" directory name with the application name
	const pos = originName.lastIndexOf(':app:');
	return originName.substr(pos + 5);
};

/**
 * Checks if the callstack is useable.
 * @return boolean
 */
const isCallTrace = (callstack: callsite.CallSite[]) : boolean => (
	typeof callstack.length === 'number'
	&& callstack.length > 1
	&& callstack[1].getFunctionName() === null
);

/**
 * Checks for cluster environments and returns a number > 1 for worker processes,
 * a 0 for the master node if running multiple processes. Returns an empty string
 * when run as a single process.
 */
function getProcessID() : string {
	const hasWorkers = isObject(cluster.workers) && Object.keys(cluster.workers).length > 0;
	const isM = cluster.isMaster;
	const isW = cluster.isWorker;

	// Multi-process master
	if (isM && !isW && hasWorkers) {
		return ':m';
	}

	// Multi-process worker
	if (!isM && isW && !hasWorkers) {
		return `:${cluster.worker.id}`;
	}

	// Single-process environment
	return '';
}
