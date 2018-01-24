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

import Website from 'base/Website';

import ParserFactory, { createFactory } from 'base/ParserFactory';

import * as app from 'app/util/applib';

import emptyCheck from 'app/util/emptyCheck';

import { ParserNotFoundError } from 'app/util/errors';
import { resolveParserModule } from '../common/parserResolver';

const log = app.createLog();

// getParserFor

export default function(website : Website) : Promise <ParserFactory> {
	emptyCheck(website);

	const parserName = getParserName(website);
	const parserData = resolveParserModule(parserName);

	return loadParserClass(parserData.moduleName).then(createFactory);
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
