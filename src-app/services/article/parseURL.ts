import { isEmpty } from 'lodash';
import { URL } from 'url';

import { EmptyError } from 'app/util/errors';

const containsHex = /(?:%3A|%2F)/i;  // Detect encoded ':' and '/' characters
const containsScheme = /^https?:\/\//;

/**
 * @throws EmptyError if the input parameter is empty
 * @throws TypeErrpr if given an invalid URL that cannot be parsed
 */
export default function (origURL : string) : string {
	if (isEmpty(origURL)) {
		throw new EmptyError('URL is empty');
	}

	const decodedURL : string = containsHex.test(origURL)
		? decodeURIComponent(origURL)
		: origURL;

	if (!containsScheme.test(decodedURL)) {
		throw new TypeError('URL must begin with a HTTP(S) scheme');
	}

	const url = new URL(decodedURL);

	return url.toString();
}
