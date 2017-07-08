import 'mocha';

import { assert } from 'chai';

import * as Cheerio from 'cheerio';

import {
	getOpenGraphHTML,
} from './testData';

import {
	getOpenGraphAuthors,
} from 'app/parser/util/AuthorParser';

describe('AuthorParser', () => {

	it('OpenGraph', function() {
		const select : Cheerio = Cheerio.load(getOpenGraphHTML());
		const authors = getOpenGraphAuthors(select);

		assert.isArray(authors);
		assert.lengthOf(authors, 2);

		assert.property(authors[0], 'name');
		assert.property(authors[0], 'email');

		assert.deepEqual(authors[0], {
			name: 'Indiana Horst',
			email: 'horst@dagbladet.no',
		});
		assert.deepEqual(authors[1], {
			name: 'Ernst Eisenbichler',
			email: 'ee@aller.com',
		});
	});

});
