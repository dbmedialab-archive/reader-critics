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
import * as Promise from 'bluebird';

import { assert } from 'chai';
import { ISuiteCallbackContext } from 'mocha';

import Article from 'base/Article';
import ArticleURL from 'base/ArticleURL';
import Website from 'base/Website';

import {
	articleService,
	websiteService,
} from 'app/services';

import { EmptyError } from 'app/util/errors';

import * as app from 'app/util/applib';

const articleDir = path.join('resources', 'article', 'json');

export default function(this: ISuiteCallbackContext) {
	let articleCount : number;

	it('parameter checks', () => {
		// assert.throws(() => articleService.get(null), EmptyError);
		assert.throws(() => articleService.save(null, null), EmptyError);
	});

	it('clear()', () => articleService.clear());

	it('save()', () => app.scanDir(articleDir).then((files : string[]) => {
		articleCount = files.length;

		return Promise.mapSeries(files, (filename : string) => {
			let article : Article;
			let website : Website;

			return app.loadJSON(path.join(articleDir, filename))
			// Check the loaded JSON data and convert the article URL
			.then((a : any) => {
				assert.isNotNull(a);
				return Object.assign(a, {
					url: new ArticleURL(a.url),
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
			.then(() => articleService.save(website, article));
		});
	}));

	it('count()', () => articleService.count().then(count => {
		assert.strictEqual(count, articleCount);
	}));

	it('get()', () => {
		const a : ArticleURL = new ArticleURL('http://www.mopo.no/2');
		const b : ArticleURL = new ArticleURL('http://something-else.xyz/goes/nowhere');

		return Promise.all([
			articleService.get(a, '201707251349'),
			articleService.get(b, 'nil'),
		])
		.then((results : Article[]) => {
			assertArticleObject(results[0]);
			assert.isNull(results[1]);
		});
	});
}

const assertArticleObject = (a : Article, name? : string) => {
	assert.isObject(a);

	[ 'url', 'version', 'authors', 'items' ].forEach(prop => {
		assert.property(a, prop);
	});

	assert.isArray(a.authors);
	assert.isArray(a.items);
};
