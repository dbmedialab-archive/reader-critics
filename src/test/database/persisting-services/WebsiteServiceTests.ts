import * as path from 'path';
import * as Promise from 'bluebird';

import { assert } from 'chai';
import { ISuiteCallbackContext } from 'mocha';

import {
	ArticleURL,
	Website,
} from 'base';

import { websiteService } from 'app/services';

import * as app from 'app/util/applib';

const demoSites = path.join('resources', 'website', 'demo-sites.json');

export default function(this: ISuiteCallbackContext) {
	it('clear()', () => websiteService.clear());

	it('save()', () => {
		let count : number;

		return app.loadJSON(demoSites)
		.then(data => {
			assert.isArray(data);
			count = data.length;

			return Promise.mapSeries(data, websiteService.save);
		})
		.then(results => {
			assert.isArray(results);
			assert.lengthOf(results, count, 'Number of saved objects does not match');
		});
	});

	it('identify()', () => {
		const a : ArticleURL = new ArticleURL('http://www.dagbladet.no/mat/67728317');
		const b : ArticleURL = new ArticleURL('http://something-else.xyz/goes/nowhere');

		return Promise.all([
			websiteService.identify(a),
			websiteService.identify(b)
		])
		.then((results : Website[]) => {
			assert.isObject(results[0]);

			[ 'name', 'hosts', 'chiefEditors' ].forEach(prop => {
				assert.property(results[0], prop);
			});

			assert.isArray(results[0].hosts);
			assert.isArray(results[0].chiefEditors);

			assert.isNull(results[1])
		});
	});
}
