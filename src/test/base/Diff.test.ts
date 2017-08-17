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

// tslint:disable max-line-length
import 'mocha';

import { assert } from 'chai';

import {
	diffString,
	DiffBit,
} from 'base/diff/diffString';

const text1A = 'Bavaria ipsum dolor eana is ma Wuascht, a bissal wos gehd ollaweil und sei Diandldrahn de Sonn nois.';
const text1B = 'Bavaria ipsum dolor eana is ma Worschd, a bisserl was geht allerweil und sei Diandldrahn de nackata.';

const expectedDiff1 : DiffBit[] = [
	{ count: 12, value: 'Bavaria ipsum dolor eana is ma ' },
	{ added: false, count: 2, removed: true, value: 'Wuascht, ' },
	{ added: true, count: 2, removed: false, value: 'Worschd, ' },
	{ count: 2, value: 'a '},
	{ added: false, count: 8, removed: true, value: 'bissal wos gehd ollaweil ' },
	{ added: true, count: 8, removed: false, value: 'bisserl was geht allerweil ' },
	{ count: 8, value: 'und sei Diandldrahn de ' },
	{ added: false, count: 4, removed: true, value: 'Sonn nois.' },
	{ added: true, count: 2, removed: false, value: 'nackata.' },
];

const text2A = 'It relates to a £2bn loan advanced to Qatar after the fundraisings were negotiated';
const text2B = 'It relates to a $200 invoice sent from Sweden after the fundraisings were negotiated';

const expectedDiff2 : DiffBit[] = [
	{ count: 8, value: 'It relates to a ' },
	{ count: 10, added: false, removed: true, value: '£2bn loan advanced to Qatar ' },
	{ count: 10, added: true, removed: false, value: '$200 invoice sent from Sweden ' },
	{ count: 10, value: 'after the fundraisings were negotiated' },
];

describe('«diffString» module', function () {

	it('Example one', function () {
		assert.deepEqual(diffString(text1A, text1B), expectedDiff1);
	});

	it('Example two', function () {
		assert.deepEqual(diffString(text2A, text2B), expectedDiff2);
	});

});
