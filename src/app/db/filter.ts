import {
	isArray,
	isObject,
} from 'lodash';

// Everything that starts with one or more underscores
const rxPropFilter = /^_+.+/;

// Based on the MDN polyfill for Object.assign, simplified and with a key filter
export function filterMeta <Z> (from : any) : Z {
	return <Z> filter(from);
}

function filter(from : any, level : number = 0) : any {
	const to = Object.create(null);
	const arrayFilter = item => isObject(item) ? filter(item, level + 1) : item;

	for (const key in from) {
		if (key === '_id' && level === 0) {
			to['ID'] = from[key].toString();
			continue;
		}
		if (rxPropFilter.test(key)) {
			continue;
		}

		if (Object.prototype.hasOwnProperty.call(from, key)) {
			if (isArray(from[key])) {
				to[key] = from[key].map(arrayFilter);
			}
			else if (isObject(from[key])) {
				to[key] = filter(from[key], level + 1);
			}
			else {
				to[key] = from[key];
			}
		}
	}

	return to;
}
