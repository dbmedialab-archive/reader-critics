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

const examples : TestRecord[] = [
	{
		url: 'http://www.dagbladet.no/nyheter/le-pen-blir-mer-kaos/67532944',
		host: 'www.dagbladet.no',
		port: n => n === null,
	},
	{
		url: 'https://whazzup.org/here/be/some',
		host: 'whazzup.org',
		port: n => n === null,
	},
	{
		url: 'http://some.hostname.de:1234/with/port',
		host: 'some.hostname.de',
		port: n => parseInt(n) === 1234,
	},
	{
		url: 'http://default.example.com:80/with/default/port',
		host: 'default.example.com',
		port: n => parseInt(n) === 80,
	},
	{
		url: 'https://secure.hostname.de:4433/with/port',
		host: 'secure.hostname.de',
		port: n => parseInt(n) === 4433,
	},
	{
		url: 'https://secure.example.com:443/with/default/port',
		host: 'secure.example.com',
		port: n => parseInt(n) === 443,
	},
	{
		url: 'http://ungueltig.com:schmarrn/',
		host: 'ungueltig.com',
		port: n => n === null,
	},
];

// Test

describe('Node «url» package', function() {
	it('should parse an URL correctly', function() {
		examples.forEach(testParser);
	});
});

function testParser(record : TestRecord) {
	const parsed = new URL(record.url);

	assert.strictEqual(parsed.hostname, record.host);
	assert.isTrue(record.port(parsed.port));
}
