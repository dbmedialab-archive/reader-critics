import 'mocha';

import { assert } from 'chai';

import { filterMeta } from 'app/db/filter';

const testData = {
	'_id': '12345',
	'name': 'dagbladet.no',
	'date': {
		'created': new Date('2017-07-21T14:46:52.224Z'),
	},
	'chiefEditors': [{
		'name': 'Quak',
		'email': 'vakt@mopo.no',
		'_id': '67890',
	}],
	'hosts': [
		'www.mopo.no',
		'www.morgenposten.no',
	],
	'singleElement': [
		123456,
	],
	'dateArray': [
		new Date('2012-07-21T19:24:09Z'),
		new Date('2016-01-09T11:25:38Z'),
	],
	'subDocument': {
		'_id': 'abcdef',
		'quak': 'Here be data',
		'uint': 10001,
	},
	'__v': 0,
};

const expected = {
	'ID': '12345',
	'name': 'dagbladet.no',
	'date': {
		'created': new Date('2017-07-21T14:46:52.224Z'),
	},
	'chiefEditors': [{
		'name': 'Quak',
		'email': 'vakt@mopo.no',
	}],
	'hosts': [
		'www.mopo.no',
		'www.morgenposten.no',
	],
	'singleElement': [
		123456,
	],
	'dateArray': [
		new Date('2012-07-21T19:24:09Z'),
		new Date('2016-01-09T11:25:38Z'),
	],
	'subDocument': {
		'quak': 'Here be data',
		'uint': 10001,
	},
};

describe('Filter', () => {
	it('Meta property filter', () => assert.deepEqual(filterMeta(testData), expected));
});
