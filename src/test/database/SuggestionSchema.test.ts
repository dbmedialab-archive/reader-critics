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
		.then(() => suggestionService.clear())
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
