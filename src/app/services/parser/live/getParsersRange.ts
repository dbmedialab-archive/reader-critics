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

// get Parsers range exist in app

export default function (): Promise <string[]> {
	const dirPath = path.resolve(__dirname, '../../../parser/impl');
	const nameReg = new RegExp(/(.+?)(?:(\.d\.ts$|\.d\.js$|\.js$|\.js\.map$|$))/, 'i');
	return new Promise((resolve, reject) => {
		return fs.readdir(dirPath, (err, files) => {
			const fileNames = [];
			if (err) {
				return reject(err);
			}
			// We need only parser name got from file names and folders are directly
			// in set folder. No extension and duplicates allowed
			files.forEach((file) => {
				const result = nameReg.exec(file);
				if (result && result.length > 1) {
					// For the case we have a folder and a file with same names
					if (!~fileNames.indexOf(result[1])) {
						fileNames.push(result[1]);
					}
				}
			});
			return resolve(fileNames);
		});
	});
}
