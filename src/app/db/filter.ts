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
	isPlainObject,
} from 'lodash';

export function filterMeta <Z> (from : any) : Z {
	return <Z> filter(from);
}

// Everything that starts with one or more underscores
const rxPropFilter = /^_+.+/;

// Based on the MDN polyfill for Object.assign, simplified and with a key filter
function filter(from : any) : any {
	const to = Object.create(null);
	// Array map function, see below
	const arrayFilter = item => isPlainObject(item) ? filter(item) : item;

	for (const key in from) {
		const v = from[key];

		// Store the hex string of the top level object ID
		if (key === '_id') {
			to['ID'] = from['_id'].toString();
			continue;
		}

		// Now check if the property name matches the filter rule, discard
		if (rxPropFilter.test(key)) {
			continue;
		}

		// Copy the property
		if (Object.prototype.hasOwnProperty.call(from, key)) {
			// Iterate over the elements of an array
			if (isArray(v)) {
				to[key] = v.map(arrayFilter);
			}
			// Recursive call to filter plain (!) objects.
			// Do not go for normal isObject check here, this will catch Date objects
			// and the like! Those should just be copied like primitive values.
			else if (isPlainObject(v)) {
				to[key] = filter(v);
			}
			// Whatever remains, just copy it over
			else {
				to[key] = v;
			}
		}
	}

	return to;
}
