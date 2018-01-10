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

import * as util from 'util';

import { assert } from 'chai';
import { articleService } from 'app/services';

import Article from 'base/Article';
import ArticleAuthor from 'base/ArticleAuthor';
import ArticleItem from 'base/ArticleItem';
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
	//	console.log(app.inspect(actual));

		if (Object.getOwnPropertyNames(result).length <= 0) {
			return;
		}

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
	assert.isString(actual.url.href);
	assert.isNotEmpty(actual.url.href);

	assert.strictEqual(actual.url.href, expected.url.href, 'Article URLs strings differ');
}

function checkVersion(actual : Article, expected : Article) {
	assert.property(actual, 'version');
	assert.isString(actual.version);
	assert.isNotEmpty(actual.version);
	assert.strictEqual(actual.version, expected.version, 'Article version strings differ');
}

function checkAuthors(actual : Article, expected : Article) {
	assert.property(actual, 'authors');
	assert.isArray(actual.authors);
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

// Check article content

function checkContent(actual : Article, expected : Article) {
	assert.property(actual, 'items');
	assert.isArray(actual.items);
	assert.isNotEmpty(actual.items, 'Array of <ArticleItem> is empty');

	assert.lengthOf(
		actual.items,
		expected.items.length,
		'Array of <ArticleItem> has different length than expected'
	);

	expected.items.forEach((expItem : ArticleItem, i : number) => {
		const actItem = actual.items[i];
		const inspect = articleItemInspect(actItem);

		// Type
		assert.property(actItem, 'type');
		assert.isString(actItem.type);
		assert.isNotEmpty(actItem.type);

		assert.strictEqual(
			actItem.type,
			expItem.type,
			`Article item ${i} has a different type\n${inspect}`
		);

		// Order
		assert.property(actItem, 'order');
		assert.isObject(actItem.order);
		assert.isNotEmpty(actItem.order);

		assert.property(actItem.order, 'item');
		assert.isNumber(actItem.order.item);

		assert.property(actItem.order, 'type');
		assert.isNumber(actItem.order.type);

		assert.strictEqual(
			actItem.order.item,
			expItem.order.item,
			`Article item ${i} has different item order\n${inspect}`
		);
		assert.strictEqual(
			actItem.order.type,
			expItem.order.type,
			`Article item ${i} has different type order\n${inspect}`
		);

		// Text
		assert.property(actItem, 'text');
		assert.isString(actItem.text);
		assert.isNotEmpty(actItem.text);

		assert.strictEqual(
			actItem.text,
			expItem.text,
			`Article item ${i} has different text\n${inspect}`
		);

		// Other properties
		if (expItem.type === 'featured' || expItem.type === 'figure') {
			assert.property(actItem, 'href');
			assert.isString(actItem.href);
			assert.isNotEmpty(actItem.href);

			assert.strictEqual(
				actItem.href,
				expItem.href,
				`Article item ${i} has different "href"\n${inspect}`
			);
		}
	});
}

const articleItemInspect = (item : ArticleItem) : string => util.inspect(item, {
	breakLength: Infinity,
	colors: false,
	depth: null,
	showHidden: true,
}) + '\n';
