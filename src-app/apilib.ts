import * as callsite from 'callsite';
import * as debug from 'debug';
import * as path from 'path';

export const appName = 'app';  // As short as possible, please

const regexFileSuffix = /\.[a-z]+?$/;
const regexDeleteIndex = /\/index$/;
const regexForwardSlashes = /\//g;

/**
 * Dynamically create a log channel based on the caller location.
 * @return function (...args : any[]) => void
 */
export function createLog(moduleName? : string) : (...args : any[]) => void {
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
