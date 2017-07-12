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
import { URL } from 'url';

// Describe the test data

interface TestRecord {
	url: string;
	host: string;
	port: Function;
}

// Declare the test data

const portProbes : string[] = [
	'http://example.com:80/narf',
	'https://secure.net:443/argh',
];

const parserProbes : TestRecord[] = [
	{
		url: 'http://www.dagbladet.no/nyheter/le-pen-blir-mer-kaos/67532944',
		host: 'www.dagbladet.no',
		port: n => n === '',
	},
	{
		url: 'https://whazzup.org/here/be/some',
		host: 'whazzup.org',
		port: n => n === '',
	},
	{
		url: 'http://some.hostname.de:1234/with/port',
		host: 'some.hostname.de',
		port: n => parseInt(n) === 1234,
	},
	{
		url: 'http://default.example.com:80/with/default/port',
		host: 'default.example.com',
		port: n => n === '',
	},
	{
		url: 'https://secure.hostname.de:4433/with/port',
		host: 'secure.hostname.de',
		port: n => parseInt(n) === 4433,
	},
	{
		url: 'https://secure.example.com:443/with/default/port',
		host: 'secure.example.com',
		port: n => n === '',
	},
	{
		url: 'http://not-so-secure.example.com:443/with/https/port',
		host: 'not-so-secure.example.com',
		port: n => parseInt(n) === 443,
	},
];

// Tests

describe('Node «url» package', function() {

	it('Throw a TypeError on a malformed URL', function() {
		assert.throws(() => {
			new URL('http://ungueltig.com:schmarrn/');
		}, TypeError);
	});

	it('Throw away default ports', function() {
		const testFn = (fromURL : string) => {
			const parsed = new URL(fromURL);
			assert.isString(parsed.port);
			assert.lengthOf(parsed.port, 0);
		};

		portProbes.forEach(testFn);
	});

	it('Parse an URL correctly', function() {
		const testFn = (record : TestRecord) => {
			const parsed = new URL(record.url);
			assert.strictEqual(parsed.hostname, record.host);
			assert.isTrue(record.port(parsed.port), `for ${record.url}`);
		};

		parserProbes.forEach(testFn);
	});

});
