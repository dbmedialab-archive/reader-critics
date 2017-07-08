import 'mocha';

import { assert } from 'chai';

import * as Cheerio from 'cheerio';

import {
	getOpenGraphHTML,
} from './testData';

import {
	getOpenGraphModifiedTime,
} from 'app/parser/util/VersionParser';

describe('VersionParser', () => {

	it('OpenGraph', function() {
		const select : Cheerio = Cheerio.load(getOpenGraphHTML());
		const version = getOpenGraphModifiedTime(select);

		assert.isString(version);
		assert.strictEqual(version, '2017-06-21T12:04:54.000Z');
	});

});
