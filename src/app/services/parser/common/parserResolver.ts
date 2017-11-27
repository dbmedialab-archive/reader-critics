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

import * as path from 'path';
import * as fs from 'fs';

import * as app from 'app/util/applib';

const availableParsers = Object.create(null);

const implRelPath = 'app/parser/impl';
const implRootPath = path.join(app.rootPath, 'out', implRelPath);

export const defaultParserName = 'Generic Parser';

export type ParserModule = {
	moduleName : string
};

type ResolveSearchEntry = {
	stats : fs.Stats
	fullpath : string
	filename : string
};

export function initParserResolver() : Promise <void> {
	return new Promise((resolve, reject) => {
		return fs.readdir(implRootPath, (err1, files) => {
			if (err1) {
				return reject(err1);
			}

			// Pull file stats for each directory entry
			files.map(filename => {
				const fullpath = path.join(implRootPath, filename);
				return {
					filename,
					fullpath,
					stats: fs.statSync(fullpath),
				};
			})

			// We're only interested in sub directories
			.filter((entry : ResolveSearchEntry) => entry.stats.isDirectory())

			// Inspect each sub directory, look for the main module file
			.forEach((entry : ResolveSearchEntry) => {
				// Create a regular expression to match the main module file
				const rx = new RegExp(`^${entry.filename.replace('-', '')}parser\.js$`, 'i');

				// Search the sub directory for that file
				fs.readdirSync(entry.fullpath).forEach(subfile => {
					if (rx.test(subfile)) {
						// This is the "human readable" name of a parser implementation
						// and at the same time the index in the map of available parsers
						const parserName = subfile
							.substr(0, subfile.length - 9)  // Remove "parser.js" at the end
							.replace(/([A-Z]+)/g, ' $1')  // Insert spaces before capitals
							.trim()
							.concat(' Parser');

						// Relative path to the parser's main module, for dynamic import
						const moduleName = path.join(
							implRelPath,
							entry.filename,
							subfile.substr(0, subfile.length - 3)
						);

						// Got it! Now create an entry in the parser map
						availableParsers[parserName] = {
							moduleName,
						} as ParserModule;
					}
				});
			});

			resolve();
		});
	});
}

export function getAvailableParsers () : Promise <string[]> {
	return Promise.resolve(Object.keys(availableParsers).sort());
}

export function resolveParserModule (parserName : string) : ParserModule {
	return availableParsers[parserName] || availableParsers[defaultParserName];
}
