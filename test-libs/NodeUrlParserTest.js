import { assert } from 'chai';

const url = require('url');

const examples = [
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
		port: n => Number.parseInt(n) === 1234,
	},
	{
		url: 'http://default.example.com:80/with/default/port',
		host: 'default.example.com',
		port: n => Number.parseInt(n) === 80,
	},
	{
		url: 'https://secure.hostname.de:4433/with/port',
		host: 'secure.hostname.de',
		port: n => Number.parseInt(n) === 4433,
	},
	{
		url: 'https://secure.example.com:443/with/default/port',
		host: 'secure.example.com',
		port: n => Number.parseInt(n) === 443,
	},
	{
		url: 'http://ungueltig.com:schmarrn/',
		host: 'ungueltig.com',
		port: n => n === null,
	},
];

describe('Node «url» package', function() {
	it('should parse an URL correctly', function() {
		examples.forEach(testParser);
	});
})

function testParser(record) {
	const parsed = url.parse(record.url);

	assert.strictEqual(parsed.hostname, record.host);
	assert.isTrue(record.port(parsed.port));
}
