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

import { DiffBit } from 'base/diff/diffString';

export type DiffTestBit = {
	oldStr : string,
	newStr : string,
	expect : {
		dbits : DiffBit[],
		plain : string,
	}
};

// Test data structure

export const testData : Array<DiffTestBit> = [
	{
		oldStr: 'Bavaria ipsum dolor eana is ma Wuascht, a bissal wos gehd ollaweil und sei Diandldrahn de Sonn nois.',
		newStr: 'Bavaria ipsum dolor eana is ma Worschd, a bisserl was geht allerweil und sei Diandldrahn de nackata.',
		expect: {
			dbits: 	[
				{ count: 12, value: 'Bavaria ipsum dolor eana is ma ' },
				{ added: false, count: 2, removed: true, value: 'Wuascht, ' },
				{ added: true, count: 2, removed: false, value: 'Worschd, ' },
				{ count: 2, value: 'a '},
				{ added: false, count: 8, removed: true, value: 'bissal wos gehd ollaweil ' },
				{ added: true, count: 8, removed: false, value: 'bisserl was geht allerweil ' },
				{ count: 8, value: 'und sei Diandldrahn de ' },
				{ added: false, count: 4, removed: true, value: 'Sonn nois.' },
				{ added: true, count: 2, removed: false, value: 'nackata.' },
			],
			plain: '<span>Bavaria ipsum dolor eana is ma</span> <del>Wuascht,</del> <ins>Worschd,</ins> <span>a</span> <del>bissal wos gehd ollaweil</del> <ins>bisserl was geht allerweil</ins> <span>und sei Diandldrahn de</span> <del>Sonn nois.</del> <ins>nackata.</ins>',
		},
	},
	{
		oldStr: 'It relates to a £2bn loan advanced to Qatar after the fundraisings were negotiated',
		newStr: 'It relates to a $200 invoice sent from Sweden after the fundraisings were negotiated',
		expect: {
			dbits: [
				{ count: 8, value: 'It relates to a ' },
				{ count: 10, added: false, removed: true, value: '£2bn loan advanced to Qatar ' },
				{ count: 10, added: true, removed: false, value: '$200 invoice sent from Sweden ' },
				{ count: 10, value: 'after the fundraisings were negotiated' },
			],
			plain: '<span>It relates to a</span> <del>£2bn loan advanced to Qatar</del> <ins>$200 invoice sent from Sweden</ins> <span>after the fundraisings were negotiated</span>',
		},
	},
	{
		oldStr: 'Erat nomoi Freibia, Freibia! Jo mei is des schee enim '
		+ 'des is schee placerat sint. Meidromml deserunt is ma Wuascht.',
		newStr: 'Erat nomoi Freibia, Freibia! Jo mei is des schee aber '
		+ 'wart mer lieber no bis zum Abnd. Meidromml deserunt is ma Wuascht.',
		expect: {
			dbits: [
				{ count: 18, value: 'Erat nomoi Freibia, Freibia! Jo mei is des schee ' },
				{ count: 12, added: false, removed: true, value: 'enim des is schee placerat sint. ' },
				{ count: 16, added: true, removed: false, value: 'aber wart mer lieber no bis zum Abnd. ' },
				{ count: 10, value: 'Meidromml deserunt is ma Wuascht.' },
			],
			plain: '<span>Erat nomoi Freibia, Freibia! Jo mei is des schee</span> <del>enim des is schee placerat sint.</del> <ins>aber wart mer lieber no bis zum Abnd.</ins> <span>Meidromml deserunt is ma Wuascht.</span>',
		},
	},
];
