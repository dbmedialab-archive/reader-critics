import 'mocha';

import * as Promise from 'bluebird';
import * as path from 'path';

import { assert } from 'chai';

import { initDatabase } from 'app/db';
import { suggestionService } from 'app/services';

import * as app from 'app/util/applib';

const tilbakemeldinger = path.join('resources', 'suggestion-box', 'tilbakemeldinger.json');

describe('SuggestionSchema', function () {

	before(function (done) {
		initDatabase()
	//	.then(() => SuggestionModel.remove({}))
		.then(() => done())
		.catch(error => done(error));
	});

	it.skip('save()', function(done) {
		let count : number;

		app.loadJSON(tilbakemeldinger)
		.then(data => {
			assert.isArray(data);
			count = data.length;

			return Promise.mapSeries(data, suggestionService.save);
		})
		.then(results => {
			assert.isArray(results);
			assert.lengthOf(results, count);
		})
		.then(() => done())
		.catch(error => done(error));
	});

	it('findSince()', function(done) {
		suggestionService.findSince(new Date('2017-07-06T00:00:00Z'))
		.then(results => console.dir(results))
		.then(() => done())
		.catch(error => done(error));
	});

});
