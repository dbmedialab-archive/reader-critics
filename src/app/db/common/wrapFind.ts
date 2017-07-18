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
	return result.lean().exec().then(results => {
		if (!isArray(results)) {
			return Promise.reject(new Error('results.exec() did not return an array'));
		}

		const unfiltered = <Array <D>> results;
		return Promise.resolve(unfiltered.map(item => filterProperties <Z> (item)));
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
	return result.lean().exec().then(singleResult => {
		if (singleResult === null) {
			return Promise.resolve(null);
		}

		if (!isObject(singleResult)) {
			return Promise.reject(new Error('result.exec() did not return a single object'));
		}

		return Promise.resolve(filterProperties <Z> (singleResult));
	});
}

// Everything that starts with one or more underscores
const rxPropFilter = /^_+.+/;

// Based on the MDN polyfill for Object.assign, simplified and with a key filter
const filterProperties = <Z> (from : any) : Z => {
	const to = Object.create(null);

	for (const key in from) {
		if (rxPropFilter.test(key)) {
			continue;
		}
		if (Object.prototype.hasOwnProperty.call(from, key)) {
			to[key] = from[key];
		}
	}

	return to;
};
