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

import 'mocha';

import { assert } from 'chai';

import ArticleURL from 'base/ArticleURL';

import { EmptyError } from 'app/util/errors';

describe('ArticleURL', () => {

	it('Reject empty parameters', function() {
		assert.throws(() => {
			new ArticleURL(undefined);
		}, EmptyError);
	});

	it('Reject invalid URLs', function() {
		const checkafew : string[] = [
			'xtcp;not#valid',
			'12345',
			'htcpcp://sencha.com/i-m/a/teapot/',
		];

		checkafew.forEach((probablyInvalidURL : string) => {
			assert.throws(() => {
				new ArticleURL(probablyInvalidURL);
			}, TypeError);
		});
	});

	it('Return decoded URLs', function() {
		const value = new ArticleURL('http%3a%2f%2fexample%2ecom%2ftest%2fpath%2f').href;
		assert.isString(value);
		assert.strictEqual(value, 'http://example.com/test/path/');
	});

	it('Transform UTF-8 into Punycode', function() {
		const value = new ArticleURL('https://你好你好').href;
		assert.isString(value);
		assert.strictEqual(value, 'https://xn--6qqa088eba/');
	});

	it('Parse an URL correctly', function() {
		const tryThese = [
			{	// Another one with encoding
				input: 'http%3A%2F%2Fwww%2Eexample%2Eorg%2Ftest',
				expect: 'http://www.example.org/test',
			},
			{	// This is to check if a port number that is default for a scheme will be removed
				input: 'http://default.example.com:80/with/default/port',
				expect: 'http://default.example.com/with/default/port',
			},
			{	// This is to check if a non-default port number will remain
				input: 'https://secure.hostname.de:4433/with/port',
				expect: 'https://secure.hostname.de:4433/with/port',
			},
			{	// The full monty, with parameters and a hash
				input: 'http://hostname.de:8080/go/there?id=1234&haribo=gummibaeren#9876cafe',
				expect: 'http://hostname.de:8080/go/there?id=1234&haribo=gummibaeren#9876cafe',
			},
		];

		tryThese.forEach((probe) => {
			const value = new ArticleURL(probe.input).href;
			assert.isString(value);
			assert.strictEqual(value, probe.expect);
		});
	});

});
