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

import * as path from 'path';

import { assert } from 'chai';
import { ISuiteCallbackContext } from 'mocha';

import Article from 'base/Article';
import ArticleURL from 'base/ArticleURL';
import Website from 'base/Website';

import { defaultLimit } from 'app/services/BasicPersistingService';
import {
	articleService,
	websiteService,
} from 'app/services';

import { EmptyError } from 'app/util/errors';

import * as app from 'app/util/applib';

const articleDir = path.join('resources', 'article', 'json');

// Main test function

export default function(this: ISuiteCallbackContext) {
	this.slow(250);

	testParameterChecks();
	testClear();
	testSave();
	testCount();

	testExists();
	testGet();
	testGetRange();
}

// Test runtime data

let articleCount : number;

// Check for thrown exceptions

const testParameterChecks = () => it('parameter checks', () => {
	assert.throws(() => articleService.get(null, null), EmptyError);
	assert.throws(() => articleService.save(null, null), EmptyError);
});

// articleService.clear()

const testClear = () => it('clear()', () => articleService.clear());

// articleService.save()

const testSave = () => it('save()', () => app.scanDir(articleDir).then((files : string[]) => {
	articleCount = files.length;

	return Promise.mapSeries(files, (filename : string) => {
		let article : Article;
		let website : Website;

		return app.loadJSON(path.join(articleDir, filename))
		// Check the loaded JSON data and convert the article URL
		.then((a : any) => {
			assert.isNotNull(a);
			return Object.assign(a, {
				url: new ArticleURL(a.url.href),
			});
		})
		// Identify the website that this article belongs to
		.then((a : Article) => {
			article = a;
			return websiteService.identify(article.url);
		})
		// Check and store the identified website
		.then((w : Website) => {
			assert.isNotNull(w);
			website = w;
		})
		// Finally: save the article to the database
		.then(() => articleService.save(website, article))
		.catch(error => {
			error.message = `${error.message} (${filename})`;
			throw error;
		});
	});
}));

// articleService.count()

const testCount = () => it('count()', () => articleService.count().then(count => {
	assert.strictEqual(count, articleCount);
}));

// articleService.exists()

const testExists = () => it('exists', () => {
	return Promise.all([
		articleService.exists('http://mopo.no/2', '201707251349'),
		articleService.exists('http://something-else.xyz/goes/nowhere', 'nil'),
	])
	.spread((a : boolean, b : boolean) => {
		assert.isTrue(a);
		assert.isFalse(b);
	});
});

// articleService.get()

const testGet = () => it('get()', () => {
	return Promise.all([
		articleService.get('http://mopo.no/2', '201707251349'),
		articleService.get('http://something-else.xyz/goes/nowhere', 'nil'),
	])
	.spread((a : Article, b : Article) => {
		assertArticleObject(a);
		assert.isNull(b);
	});
});

// articleService.getRange()

const testGetRange = () => it('getRange()', () => {
	const testLimit = 2;

	return Promise.all([
		// #1 should return the lesser of "defaultLimit" or "websiteCount" number of items:
		articleService.getRange(),
		// #2 should return exactly "testLimit" items:
		articleService.getRange(0, testLimit),
		// #3 skipping past the number of stored items should yield an empty result:
		articleService.getRange(articleCount),
	])
	.spread((...ranges : Article[][]) => {
		ranges.forEach(result => {
			assert.isArray(result);
			result.forEach(item => assertArticleObject(item));
		});

		const lengthCheck = [
			Math.min(articleCount, defaultLimit),
			testLimit,
			0,
		];

		ranges.forEach((result : Article[], index : number) => {
			assert.lengthOf(
				result,
				lengthCheck[index],
				`Incorrect number of objects in test range #${index + 1}`
			);
		});
	});
});

// Generic structure check

const assertArticleObject = (a : Article, name? : string) => {
	assert.isObject(a);

	[ 'url', 'version', 'authors', 'items' ].forEach(prop => {
		assert.property(a, prop);
	});

	assert.isArray(a.authors);
	assert.isArray(a.items);
};
