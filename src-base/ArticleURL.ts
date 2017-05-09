import * as url from 'url';

import { isEmpty } from 'lodash';

export default class ArticleURL {

	private host : string;
	private path : string;

	// Static factory

	public static fromString(plainURL : string) : ArticleURL {
		if (isEmpty(plainURL)) {
			throw new Error('Article URL must not be empty');
		}

		const parsed = url.parse(plainURL);

		return new ArticleURL(parsed.hostname, parsed.path)
	}

	// Constructor

	constructor(host : string, path : string) {
		if (host === null ? true : host.length <= 0) {
			throw new Error('Article URL hostname must not be empty');
		}
		this.host = host;

		if (path === null ? true :path.length <= 0) {
			throw new Error('Article URL hostname must not be empty');
		}
		this.path = path;
	}

	// Accessors

	public getHost() : string {
		return this.host;
	}

	public getPath() : string {
		return this.path;
	}

}
