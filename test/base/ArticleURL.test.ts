// import { describe } from 'mocha';
import { assert } from 'chai';

import ArticleURL from 'app/base/ArticleURL';

import { EmptyError } from 'app/util/errors';

describe('ArticleURL', () => {

	it('Reject empty parameters', function() {
		assert.throws(() => { new ArticleURL(undefined) }, EmptyError);
	});

	it('Reject invalid URLs', function() {
		const checkafew : string[] = [
			'xtcp;not#valid',
			'12345',
			'htcpcp://sencha.com/i-m/a/teapot/',
		];

		checkafew.forEach((probablyInvalidURL : string) => {
			assert.throws(() => { new ArticleURL(probablyInvalidURL) }, TypeError);
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
				expect: 'http://www.example.org/test'
			},
			{	// This is to check if a port number that is default for a scheme will be removed
				input: 'http://default.example.com:80/with/default/port',
				expect: 'http://default.example.com/with/default/port'
			},
			{	// This is to check if a non-default port number will remain
				input: 'https://secure.hostname.de:4433/with/port',
				expect: 'https://secure.hostname.de:4433/with/port'
			},
			{	// The full monty, with parameters and a hash
				input: 'http://hostname.de:8080/go/there?id=1234&haribo=gummibaeren#9876cafe',
				expect: 'http://hostname.de:8080/go/there?id=1234&haribo=gummibaeren#9876cafe'
			}
		];

		tryThese.forEach((probe) => {
			const value = new ArticleURL(probe.input).href;
			assert.isString(value);
			assert.strictEqual(value, probe.expect);
		});
	});

});
