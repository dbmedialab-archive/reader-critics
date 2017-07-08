import { isArray } from 'lodash';

import {
	Document,
	DocumentQuery,
} from 'mongoose';

/**
 * @param result A DocumentQuery produced with Model.find()
 * @return An array of plain object of type Z, all excess properties removed
 */
export default function <D extends Document, Z> (
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
