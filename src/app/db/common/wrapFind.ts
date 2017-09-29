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

import {
	isArray,
	isObject,
} from 'lodash';

import {
	Document,
	DocumentQuery,
} from 'mongoose';

import { filterMeta } from 'app/db/filter';

/**
 * @param result A DocumentQuery produced with Model.find()
 * @return An array of plain objects of type Z, all excess properties removed
 */
export function wrapFind <D extends Document, Z> (
	result : DocumentQuery <D[], D>
) : Promise <Z[]>
{
	// Due to the typings of Mongoose, type information gets lost on the way
	// between lean() and exec(). Normal use of this function should result
	// in the query issuing an array of "lean" documents, the case where exec()
	// only produces a single object is when using cursors.
	// We type-check for array and later on cast to the desired target type.
	return new Promise((resolve, reject) => {
		result.lean().exec().then(results => {
			if (!isArray(results)) {
				return reject(new Error('results.exec() did not return an array'));
			}
			return resolve(results.map(item => filterMeta<Z>(item)));
		});
	});
}

/**
 * @param result A DocumentQuery produced with Model.find()
 * @return An array of plain objects of type Z, all excess properties removed
 */
export function wrapFindOne <D extends Document, Z> (
	result : DocumentQuery <D, D>
) : Promise <Z>
{
	return new Promise((resolve, reject) => {
		result.exec()
		.then((doc : D) => {
			if (doc === null) {
				return resolve(null);
			}
			// console.log('------------------------------------------------------------');
			// console.log('wrapFindOne:', doc);
			// console.log('\n');
			return doc.toObject();
		})
		.then((doc : any) => {
			if (!isObject(doc)) {
				return reject(new Error('result.exec() did not return a single object'));
			}

			return resolve(filterMeta<Z>(doc));
		});
	});
}
