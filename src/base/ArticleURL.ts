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

import { isEmpty } from 'lodash';
import { URL } from 'url';

import { EmptyError } from 'app/util/errors';

const containsHex = /(?:%3A|%2F)/i;  // Detect encoded ':' and '/' characters
const containsScheme = /^https?:\/\//;

export default class ArticleURL {

	readonly url : URL;
	readonly href : string;

	public static from(origURL : string) : Promise <ArticleURL> {
		return new Promise <ArticleURL> ((resolve, reject) => {
			try {
				return resolve(new ArticleURL(origURL));
			}
			catch (error) {
				return reject(error);
			}
		});
	}

	// Constructor

	constructor(origURL : string) {
		if (isEmpty(origURL)) {
			throw new EmptyError('Article URL is undefined or empty');
		}

		const decodedURL : string = containsHex.test(origURL)
			? decodeURIComponent(origURL)
			: origURL;

		if (!containsScheme.test(decodedURL)) {
			throw new TypeError('URL must begin with a HTTP(S) scheme');
		}

		this.url = new URL(decodedURL);
		this.href = this.url.toString();
	}

	// Accessors

	public toString() : string {
		return this.href;
	}

}
