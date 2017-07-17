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
		console.dir(a.href);

		return websiteService.identify(a).then((w : Website) => {
			console.log('und dann:', app.inspect(w));
		});
	});
}
