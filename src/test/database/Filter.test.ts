import 'mocha';

import { assert } from 'chai';

import { filterMeta } from 'app/db/filter';

const testData = {
	'_id': '12345',
	'name': 'dagbladet.no',
	'date': {
		'created': '2017-07-21T14:46:52.224Z',
	},
	'chiefEditors': [{
		'name': 'Quak',
		'email': 'vakt@mopo.no',
		'_id': '67890',
	}],
	'hosts': [ 'www.mopo.no' ],
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
		'created': '2017-07-21T14:46:52.224Z',
	},
	'chiefEditors': [{
		'name': 'Quak',
		'email': 'vakt@mopo.no',
	}],
	'subDocument': {
		'quak': 'Here be data',
		'uint': 10001,
	},
	'hosts': [ 'www.mopo.no' ],
};

describe('Filter', () => {
	it('Meta property filter', () => assert.deepEqual(filterMeta(testData), expected));
});
