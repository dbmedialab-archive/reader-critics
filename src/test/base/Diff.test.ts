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

import { diffString } from 'base/diff/diffString';
import { diffToPlainHTML } from 'base/diff';

import {
	testData,
	DiffTestBit,
} from './DiffTestData';

describe('«diff» module', function () {

	testData.forEach((d : DiffTestBit, index : number) => {
		it(`diffString() #${index+1}`, function () {
			assert.deepEqual(diffString(d.oldStr, d.newStr), d.expect.dbits);
		});

		it(`diffToPlainHTML() #${index+1}`, function () {
			assert.strictEqual(diffToPlainHTML(d.oldStr, d.newStr), d.expect.plain);
		});
	});

});
