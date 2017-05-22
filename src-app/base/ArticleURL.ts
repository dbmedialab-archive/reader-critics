import { isEmpty } from 'lodash';
import { URL } from 'url';

import { EmptyError } from 'app/util/errors';

const containsHex = /(?:%3A|%2F)/i;  // Detect encoded ':' and '/' characters
const containsScheme = /^https?:\/\//;

export default class ArticleURL {

	private url : URL;

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

		this.url = new URL(decodedURL);
	}

	// Accessors

	public toString() : string {
		return this.url.toString();
	}

}
