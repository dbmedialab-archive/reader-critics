import {
	isArray,
	isObject,
} from 'lodash';

// Everything that starts with one or more underscores
const rxPropFilter = /^_+.+/;

// Based on the MDN polyfill for Object.assign, simplified and with a key filter
export default function <Z> (from : any) : Z {
	return <Z> filter(from);
}

function filter(from : any) : any {
	const to = Object.create(null);

	for (const key in from) {
		if (rxPropFilter.test(key)) {
			continue;
		}
		if (Object.prototype.hasOwnProperty.call(from, key)) {
			if (isArray(from[key])) {
				to[key] = from[key].map(item => isObject(item) ? filter(item) : item);
			}
			else if (isObject(from[key])) {
				to[key] = filter(from[key]);
			}
			else {
				to[key] = from[key];
			}
		}
	}

	return to;
}
