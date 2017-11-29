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

import {
	getAvailableParsers,
	initParserResolver,
} from 'app/services/parser/common/parserResolver';

describe('ParserService', () => {
	it('getAvailableParsers', () => {
		return initParserResolver()
		.then(() => getAvailableParsers())
		.then((parsers : string[]) => {
			// It should at least find two parser implementations (see next)
			assert.isAtLeast(parsers.length, 2);
			// Check if our default implementations are resolved
			assert.include(parsers, 'AMP Parser');
			assert.include(parsers, 'Generic Parser');
		});
	});
});
