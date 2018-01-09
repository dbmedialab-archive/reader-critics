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
	collectArticleFiles,
	loadResultJSON,
	mapSitesToParser,
} from './articleSitesAndFiles';

import {
	getAvailableParsers,
	initParserResolver,
} from 'app/services/parser/common/parserResolver';

import {
	parserService,
	websiteService,
} from 'app/services';

import { assertParserFactory } from './assertParserFactory';
import { runParserTest } from './runParserTest';

import Website from 'base/Website';

describe('Parser resolver', function() {
	before(function() {
		return initParserResolver();
	});

	it('getAvailableParsers', function() {
		return getAvailableParsers()
		.then((parsers : string[]) => {
			// It should at least find three parser implementations (see next)
			assert.isAtLeast(parsers.length, 3);
			// Check if our default implementations are resolved
			assert.include(parsers, 'AMP Parser');
			assert.include(parsers, 'Dagbladet Parser');
			assert.include(parsers, 'Generic Parser');
		});
	});
});

describe('Parser implementations', function() {
	const inputFiles = collectArticleFiles();

	Object.keys(mapSitesToParser).sort().forEach(hostName => {
		const parserName = mapSitesToParser[hostName];

		describe(parserName, function() {
			let website : Website;

			this.slow(5000);

			// Get a (mock) website object
			before(function() {
				return websiteService  // Using the mock implementation, no database!
				.identify(`http://${hostName}/something`)
				.then(w => website = w);
			});

			// Test if the parser service returns a factory for the current website
			it('resolves the parser factory', () => (
				parserService.getParserFor(website)
				.then(factory => assertParserFactory(factory))
			));

			// Parse and deep-compare all articles
			inputFiles
				// Filter those that belong to the current website
				.filter(fileName => fileName.includes(hostName))
				// Dynamically create tests for this article object
				.forEach(function(fileName) {
					const articleID = parseInt(fileName.replace(/^.+_(\d+)\.html$/, '$1'));

					it(`parse article ${hostName} / ${articleID}`, function() {
						return loadResultJSON(fileName)
						// Skip this test is the result (expected) JSON data was not found
						.catch(err => this.skip())
						// Do the magic
						.then((resultJSON) => runParserTest(
							website,
							hostName,
							articleID,
							resultJSON
						));
					}); // it()
				}); // inputFiles...forEach()
		}); // describe(parserName)
	}); // mapSitesToParser.forEach()
});
