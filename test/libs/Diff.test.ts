import 'mocha';

import { assert } from 'chai';
import { diffWords } from 'diff';

const textA = 'Bavaria ipsum dolor eana is ma Wuascht, a bissal wos gehd ollaweil und sei Diandldrahn de Sonn nois.';
const textB = 'Bavaria ipsum dolor eana is ma Worschd, a bisserl was geht allerweil und sei Diandldrahn de nackata.';

const expected : any[] = [
	{ count: 12, value: 'Bavaria ipsum dolor eana is ma ' },
	{ count: 1, added: undefined, removed: true, value: 'Wuascht' },
	{ count: 1, added: true, removed: undefined, value: 'Worschd' },
	{ count: 4, value: ', a ' },
	{ count: 1, added: undefined, removed: true, value: 'bissal' },
	{ count: 1, added: true, removed: undefined, value: 'bisserl' },
	{ count: 1, value: ' ' },
	{ count: 1, added: undefined, removed: true, value: 'wos' },
	{ count: 1, added: true, removed: undefined, value: 'was' },
	{ count: 1, value: ' ' },
	{ count: 1, added: undefined, removed: true, value: 'gehd' },
	{ count: 1, added: true, removed: undefined, value: 'geht' },
	{ count: 1, value: ' ' },
	{ count: 1, added: undefined, removed: true, value: 'ollaweil' },
	{ count: 1, added: true, removed: undefined, value: 'allerweil' },
	{ count: 9, value: ' und sei Diandldrahn de ' },
	{ count: 3, added: undefined, removed: true, value: 'Sonn nois' },
	{ count: 1, added: true, removed: undefined, value: 'nackata' },
	{ count: 1, value: '.' },
];

describe('«diff» package', function() {

	it('#diffWords', function() {
		assert.deepEqual(diffWords(textA, textB), expected);
	});

});
