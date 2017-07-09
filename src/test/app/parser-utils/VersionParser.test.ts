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

import * as Cheerio from 'cheerio';

import {
	getOpenGraphHTML,
} from './testData';

import {
	getOpenGraphModifiedTime,
} from 'app/parser/util/VersionParser';

describe('VersionParser', () => {

	it('OpenGraph', function() {
		const select : Cheerio = Cheerio.load(getOpenGraphHTML());
		const version = getOpenGraphModifiedTime(select);

		assert.isString(version);
		assert.strictEqual(version, '2017-06-21T12:04:54.000Z');
	});

});
