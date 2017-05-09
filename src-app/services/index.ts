import * as colors from 'ansicolors';
import * as path from 'path';
import * as requireAll from 'require-all';

import * as api from '../apilib';

const log = api.createLog();

// Regular expression matchers for file name patterns

const matchDev = /^\w+Service\.dev\.[jt]s$/;
const matchMock = /^\w+Service\.mock\.[jt]s$/;
const matchProd = /^\w+Service\.[jt]s$/;

// Which matchers to try for which execution environment?
// The order is important. Modules/files matched in later iterations get precedence.

const serviceNameMatchers = {
	production: [
		matchProd,
	],
	development: [
		matchProd,
		matchDev,
	],
	test: [
		matchMock,
	],
};

const matchSet : Array<RegExp> = serviceNameMatchers[api.env];
const servicesFound = Object.create(null);

// Iterate over all filename matchers and invoke requireAll (scroll down for explanation)

matchSet.forEach((matcher : RegExp) => {
	log('Running matcher', colors.brightRed(matcher.source));

	const foundServices : any = requireAll({
		dirname: __dirname,
		recursive: true,
		filter: (filename : string) => matcher.test(filename) ? filename : false,
	});

	const directoryNames : Array<string> = Object.keys(foundServices);

	directoryNames.forEach((thisDirectory) => {
		const directoryStruct = foundServices[thisDirectory];
		const fileNames : Array<string> = Object.keys(directoryStruct);

		if (fileNames.length < 1) {
			return;  // No match found, does not need to be processed
		}

		if (fileNames.length > 1) {
			throw new Error('Only one service module should be declared per package directory');
		}

		// What remains is the name of the one file that contains the service module
		const fileName : string = fileNames[0];
		const moduleStruct = directoryStruct[fileName];
		const serviceName = fileName.replace(/^(\w+)(Service\..+)$/, '$1');

		// This intermediate structure contains a bit more information than needed to create the service
		// exports, but this is used for verbose logging about what was found and is exported.
		servicesFound[serviceName] = {
			origin: fileName,
			module: moduleStruct,
		};
	});
});

// Transform the intermediate service descriptors into one export, log all findings

const arrggh : any = {};

Object.keys(servicesFound).sort().forEach((serviceName : string) => {
	const serviceDescr = servicesFound[serviceName];

	// Make some colorful anouncements about what the factory has figured out
	const n = colors.brightWhite(serviceName);
	const f = Object.keys(serviceDescr.module).map(name => colors.brightCyan(name)).join(', ');
	const o = colors.brightYellow(serviceDescr.origin);

	log('%s exports { %s } from %s', n, f, o);

	// Store the exported module as one symbol of the factory's exports
	arrggh[serviceName] = Object.freeze(serviceDescr.module);
});

//module.exports = Object.freeze(a);

//export arrggh;

// requireAll() in recursive mode basically returns a structure like this:
//
// 	{
// 		other: {
// 			'OtherService.js': {
// 				getSomethingCompletelyDifferent: [Function],
// 				getOther: [Function]
// 			}
// 		},
// 		template: {
// 			'TemplateService.js': {
// 				getTemplate: [Function],
// 				getSomethingElse: [Function]
// 			}
// 		}
// 	}
//
// The first level is the names of the directories where any matches were found in. The second level
// is the file names that matched. They point to an object structure of whatever the module exports.
