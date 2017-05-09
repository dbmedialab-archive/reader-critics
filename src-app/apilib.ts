import * as callsite from 'callsite';
import * as debug from 'debug';
import * as findRoot from 'find-root';
import * as path from 'path';

// Application environment

/** The current environment that this app is running in */
const findEnvironment = () => {
	let e = process.env.NODE_ENV || null;
	if (0 > ['production', 'development', 'test'].indexOf(e)) {
		e = 'development';
	//	throw new Error(`Unknown execution environment "${e}"`);
		console.log(`Execution environment not set, assuming "${e}"`);
	}
	return e;
};

export const env : string = findEnvironment();

// Filesystem

/** The filesystem root of the whole project */
export const rootPath : string = findRoot(path.dirname(require.main.filename));

// Logging

/** First component of debug's logger */
export const appName = 'app';  // As short as possible, please

const regexFileSuffix = /\.[a-z]+?$/;
const regexDeleteIndex = /\/index$/;
const regexForwardSlashes = /\//g;

/**
 * Dynamically create a log channel based on the caller location.
 * @return function (...args : any[]) => void
 */
export function createLog(moduleName? : string) : (...args : any[]) => void {  // hvorfor ikke debug.IDebugger ??
	const name = moduleName !== undefined
		? `${appName}:${moduleName}`
		: logChannelName (callsite());

	return debug(name);
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
		.replace(regexForwardSlashes, ':');  // replace slashes with colons

	// Replace "app" directory name with the application name
	const pos = originName.lastIndexOf(':app:');
	return `${appName}${originName.substr(pos + 4)}`;
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
