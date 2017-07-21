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

import { suggestionService } from 'app/services';

import Suggestion from 'base/Suggestion';

import * as app from 'app/util/applib';

const tilbakemeldinger = path.join('resources', 'suggestion-box', 'tilbakemeldinger.json');

export default function(this: ISuiteCallbackContext) {
	it('clear()', () => suggestionService.clear());

	it('save()', () => {
		let count : number;

		return app.loadJSON(tilbakemeldinger)
		.then(data => {
			assert.isArray(data);
			count = data.length;

			return Promise.mapSeries(data, suggestionService.save);
		})
		.then(results => {
			assert.isArray(results);
			assert.lengthOf(results, count, 'Number of saved objects does not match');
		});
	});

	it('count()', () => {
		return suggestionService.count().then(count => {
			assert.strictEqual(count, 15);
		});
	});

	it('findSince()', () => {
		const dateSince = new Date('2017-07-06T00:00:00Z');

		return suggestionService.findSince(dateSince)
		.then((results : Suggestion[]) => {
			// Date checks
			results.forEach((result : Suggestion) => {
				const thatDate = new Date(result.date.created);

				assert.isTrue(app.isValidDate(thatDate), 'Result date is not valid');
				assert.isTrue(thatDate >= dateSince, 'Result date must be greater than query date');
			});

			// With the current test data we expect 5 result objects
			assert.lengthOf(results, 5, 'Number of result objects does not match');
		});
	});
}
