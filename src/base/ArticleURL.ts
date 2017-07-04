import { isEmpty } from 'lodash';
import { URL } from 'url';

import { EmptyError } from 'app/util/errors';

const containsHex = /(?:%3A|%2F)/i;  // Detect encoded ':' and '/' characters
const containsScheme = /^https?:\/\//;

export default class ArticleURL {

	readonly href : string;

	// Constructor

	constructor(origURL : string) {
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
		this.href = url.toString();
	}

	// Accessors

	public toString() : string {
		return this.href;
	}

}
