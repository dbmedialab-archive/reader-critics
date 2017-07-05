import Website from 'base/Website';

import ParserFactory, { createFactory } from 'base/ParserFactory';

import * as app from 'app/util/applib';

import { ParserNotFoundError } from 'app/util/errors';

const log = app.createLog();

// getParserFor

export default function(website : Website) : Promise <ParserFactory> {
	const importName = `app/parser/impl/${getParserName(website)}`;
	log('"%s" resolves to %s', website.name, importName);

	return loadParserClass(importName).then(createFactory);
}

// Parser class name

const hasParser = (website : Website) : boolean =>
	(typeof website.parserClass === 'string') && (website.parserClass !== null);

const getParserName = (website : Website) : string =>
	hasParser(website) ? website.parserClass : 'GenericParser';

// Class loader

const isConstructor = (fn : any) : boolean =>
	(typeof fn === 'function') && (typeof fn.prototype === 'object');

function loadParserClass(importName : string) : Promise <Function> {
	// If you have TSlint on and your IDE is yelling "error" here, this actually works!
	return import(importName).then(parserModule => parserModule.default)
	.then((constructorFn : any) => {
		if (!isConstructor(constructorFn)) {
			return Promise.reject(new TypeError(`Default export of ${importName} is not a class`));
		}

		return constructorFn;
	})
	.catch((error) => {
		if (error.code === 'MODULE_NOT_FOUND') {
			return Promise.reject(new ParserNotFoundError(`${importName} not found`));
		}
		return Promise.reject(error);
	});
}
