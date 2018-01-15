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

// import * as app from 'app/util/applib';

import { assert } from 'chai';
import { articleService } from 'app/services';
import { checkContent } from './assertArticleContent';

import Article from 'base/Article';
import ArticleAuthor from 'base/ArticleAuthor';
import ArticleURL from 'base/ArticleURL';
import Website from 'base/Website';

export function runParserTest(
	website : Website,
	hostName : string,
	articleID : number,
	result : {}
) : Promise <void>
{
	return ArticleURL.from(`http://${hostName}/${articleID}`)
	// Invoke fetch() from the article service. In test mode, this will load the
	// static HTML files from the resource directory (instead of trying to
	// download something over the network) and then put them into the parser
	// engine. The outcome should be a complete article object, like it would be
	// persisted to the database.
	.then((url : ArticleURL) => articleService.fetch(website, url))
	// Perform a deep and through comparison of the parsed article object and the
	// data structure that is expected. Again, the latter is a static resource.
	.then((actual : Article) => {
		if (actual.url.href.includes('nettavisen')) {
		//	console.log(app.inspect(actual));
		}

		// if (Object.getOwnPropertyNames(result).length <= 0) {
		// 	return;
		// }

		const expected = result as Article;  // Type-cast the "expected" data

		checkURL(actual, expected);
		checkVersion(actual, expected);
		checkAuthors(actual, expected);
		checkContent(actual, expected);
	});
}

// Check functions for the "more meta" properties

function checkURL(actual : Article, expected : Article) {
	assert.property(actual, 'url');
	assert.isObject(actual.url);

	assert.property(actual.url, 'href');
	assert.isString(actual.url.href, 'Article URL "href" is not a string');
	assert.isNotEmpty(actual.url.href, 'Article URL "href" is empty');

	assert.strictEqual(actual.url.href, expected.url.href, 'Article URLs strings differ');
}

function checkVersion(actual : Article, expected : Article) {
	assert.property(actual, 'version');
	assert.isString(actual.version, 'Article "version" is not a string');
	assert.isNotEmpty(actual.version, 'Article "version" is empty');
	assert.strictEqual(actual.version, expected.version, 'Article version strings differ');
}

function checkAuthors(actual : Article, expected : Article) {
	assert.property(actual, 'authors');
	assert.isArray(actual.authors, 'Article "authors" is not a string');
	assert.isNotEmpty(actual.authors, 'Array of <ArticleAuthor> is empty');

	assert.lengthOf(
		actual.authors,
		expected.authors.length,
		'Array of <ArticleAuthor> has different length than expected'
	);

	// Yes, this type of comparison loop means that the order of the parsed
	// authors is expected to stay the same
	expected.authors.forEach((a : ArticleAuthor, i : number) => {
		assert.strictEqual(actual.authors[i].name, a.name);
		assert.strictEqual(actual.authors[i].email, a.email);
	});
}
