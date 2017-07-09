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

import * as fs from 'fs';
import * as path from 'path';
import * as findRoot from 'find-root';

import { isTest } from './environment';

/** The filesystem root of the whole project */
export const rootPath : string = findRoot((isTest && process.env.CWD !== undefined)
	? process.env.CWD
	: path.dirname(require.main.filename));

export function loadResource(relativePath : string) : Promise <Buffer> {
	return new Promise((resolve, reject) => {
		const fullPath : string = path.join(rootPath, relativePath);

		fs.open(fullPath, 'r', (errOpen) => {
			if (errOpen) {
				if (errOpen.code === 'ENOENT') {
					return reject(new Error(`${fullPath} does not exist`));
				}

				return reject(errOpen);
			}

			fs.readFile(fullPath, (errRead, data : Buffer) => {
				if (errRead) {
					return reject(errRead);
				}

				return resolve(data);
			});
		});
	});
}

export function loadJSON(relativePath : string) : Promise <any> {
	return loadResource(relativePath)
		.then(buffer => JSON.parse(buffer.toString()));
}
