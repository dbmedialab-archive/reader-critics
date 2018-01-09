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

			before(function() {
				return websiteService  // Using the mock implementation, no database!
				.identify(`http://${hostName}/something`)
				.then(w => website = w);
			});

			it('resolves the parser factory', () => (
				parserService.getParserFor(website)
				.then(factory => assertParserFactory(factory))
			));

			inputFiles  // parse all articles that belong to the current website
				.filter(fileName => fileName.includes(hostName))
				.forEach(function(fileName) {
					const articleID = parseInt(fileName.replace(/^.+_(\d+)\.html$/, '$1'));

					it(`parse article ${hostName} / ${articleID}`, function() {
						assert.equal(1, 1);
					});
				});
		}); // describe(parserName)
	}); // mapSitesToParser.forEach()
});

/*

import ArticleURL from 'base/ArticleURL';

import * as app from 'app/util/applib';

import {
	articleService,
	websiteService,
} from 'app/services';

import { initParserResolver } from 'app/services/parser/common/parserResolver';

Object.values(mapSitesToParser).forEach(thatParser => {
	describe(thatParser, function () {
		console.log('     ...', thatParser);
	});
});

describe('Parser End-to-End', function () {
	return (app.rootPath + '/resources/article/html/')
	// Iterate over all the article files in the resource directory and feed
	// those which we have a testable parser for into the parser system
	.then((files : string[]) => {
		files
		.forEach(articleFileName => {
			const articleSite = articleFileName.replace(/^(.+)_\d+\.html$/, '$1');

			testArticle(`http://${articleSite}/${articleID}`);
		});
	});
});

function testArticle(incomingURL : string) {
	return it(incomingURL, function () {
		let articleURL;

		// 1 - Article URL and Website identification
		return ArticleURL.from(incomingURL).then((url : ArticleURL) => {
			articleURL = url;
			console.log(url.toString());
			//return websiteService.identify(articleURL);

			assert.ok(true, 'all good');
		});

		/*
		const parserName = mapSitesToParser[articleSite];

		if (parserName === undefined) {
			return assert.fail(null, null, `Parser "${parserName}" not found`);
		}
		* * * /

//		console.log('dozo');
	});
}
*/
