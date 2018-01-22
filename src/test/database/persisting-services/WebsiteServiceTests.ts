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

import ArticleURL from 'base/ArticleURL';
import Website from 'base/Website';

import { defaultLimit } from 'app/services/BasicPersistingService';
import { websiteService } from 'app/services';
import { EmptyError } from 'app/util/errors';

import * as app from 'app/util/applib';

const demoSites = path.join('resources', 'website', 'demo-sites.json5');

export default function(this: ISuiteCallbackContext) {
	let websiteCount : number;

	this.slow(250);

	it('parameter checks', () => {
		assert.throws(() => websiteService.get(null), EmptyError);
		assert.throws(() => websiteService.identify(null), EmptyError);
		assert.throws(() => websiteService.save(null), EmptyError);
	});

	it('clear()', () => websiteService.clear());

	it('save()', () => app.loadJSON(demoSites).then(data => {
		assert.isArray(data);
		websiteCount = data.length;

		return Promise.mapSeries(data, websiteService.save);
	})
	.then(results => {
		assert.isArray(results);
		assert.lengthOf(results, websiteCount, 'Number of saved objects does not match');
	}));

	it('count()', () => websiteService.count().then(count => {
		assert.strictEqual(count, websiteCount);
	}));

	it('get()', () => {
		return Promise.all([
			websiteService.get('dagbladet.no'),
			websiteService.get('something-else.xyz'),
		])
		.then((results : Website[]) => {
			assertWebsiteObject(results[0], 'dagbladet.no');
			assert.isNull(results[1]);
		});
	});

	it('getRange()', () => {
		const testLimit = 2;

		return Promise.all([
			// #1 should return the lesser of "defaultLimit" or "websiteCount" number of items:
			websiteService.getRange(),
			// #2 should return exactly "testLimit" items:
			websiteService.getRange(0, testLimit),
			// #3 skipping past the number of stored items should yield an empty result:
			websiteService.getRange(websiteCount),
		]).then((results : [Website[]]) => {
			results.forEach(result => {
				assert.isArray(result);
				result.forEach(item => assertWebsiteObject(item));
			});

			const lengthCheck = [
				Math.min(websiteCount, defaultLimit),
				testLimit,
				0,
			];

			results.forEach((result : Website[], index : number) => {
				assert.lengthOf(
					result,
					lengthCheck[index],
					`Incorrect number of objects in test range #${index + 1}`
				);
			});
		});
	});

	it('identify()', () => {
		const a : ArticleURL = new ArticleURL('http://www.dagbladet.no/mat/67728317');
		const b : ArticleURL = new ArticleURL('http://something-else.xyz/goes/nowhere');

		return Promise.all([
			websiteService.identify(a),
			websiteService.identify(b),
		])
		.then((results : Website[]) => {
			assertWebsiteObject(results[0], 'dagbladet.no');
			assert.isNull(results[1]);
		});
	});
}

const assertWebsiteObject = (w : Website, name? : string) => {
	assert.isObject(w);

	[ 'name', 'hosts', 'chiefEditors' ].forEach(prop => {
		assert.property(w, prop);
	});

	assert.isArray(w.hosts);
	assert.isArray(w.chiefEditors);

	if (name) {
		assert.strictEqual(w.name, name);
	}
};
