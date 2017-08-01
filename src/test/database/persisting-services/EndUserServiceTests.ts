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

import EndUser from 'base/EndUser';

import { defaultLimit } from 'app/services/BasicPersistingService';
import { enduserService } from 'app/services';
import { EmptyError } from 'app/util/errors';

import * as app from 'app/util/applib';

const demoUsers = path.join('resources', 'user', 'demo-endusers.json5');

export default function(this: ISuiteCallbackContext) {
	let userCount : number;

	it('parameter checks', () => {
		assert.throws(() => enduserService.get(null), EmptyError);
		assert.throws(() => enduserService.get(null, null), EmptyError);

		assert.throws(() => enduserService.get(''), EmptyError);
		assert.throws(() => enduserService.get('', ''), EmptyError);

		assert.doesNotThrow(() => enduserService.get('Jake Peralta'), Error);
		assert.doesNotThrow(() => enduserService.get(null, 'det.peralta@99prec.nyc'), Error);

		assert.throws(() => enduserService.save(null), EmptyError);
	});

	it('clear()', () => enduserService.clear());

	it('save()', () => app.loadJSON(demoUsers).then(data => {
		assert.isArray(data);
		userCount = data.length;

		return Promise.mapSeries(data, enduserService.save);
	})
	.then((results : EndUser[]) => {
		assert.isArray(results);
		assert.lengthOf(results, userCount, 'Number of saved objects does not match');

		results.forEach(u => assertUserObject(u));
	}));

	it('count()', () => enduserService.count().then(count => {
		assert.strictEqual(count, userCount);
	}));

	it('get()', () => {
		return Promise.all([
			enduserService.get('Indiana Horst'),
			enduserService.get(null, 'prost.mahlzeit@lulu.org'),
		//	enduserService.get('Ernst Eisenbichler', 'ee@aller.com'),
		]).then((results : EndUser[]) => {
			results.forEach(u => assertUserObject(u));
		});
	});

	it('getRange()', () => {
		const testLimit = 5;

		return Promise.all([
			// #1 should return the lesser of "defaultLimit" or "websiteCount" number of items:
			enduserService.getRange(),
			// #2 should return exactly "testLimit" items:
			enduserService.getRange(0, testLimit),
			// #3 skipping past the number of stored items should yield an empty result:
			enduserService.getRange(userCount),
		]).then((results : [EndUser[]]) => {
			results.forEach(result => {
				assert.isArray(result);
				result.forEach(item => assertUserObject(item));
			});

			const lengthCheck = [
				Math.min(userCount, defaultLimit),
				testLimit,
				0,
			];

			results.forEach((result : EndUser[], index : number) => {
				assert.lengthOf(
					result,
					lengthCheck[index],
					`Incorrect number of objects in test range #${index + 1}`
				);
			});
		});
	});
}

const assertUserObject = (u : EndUser, noPassword = true, name? : string) => {
	assert.isObject(u);

	[ 'ID', 'name', 'email' ].forEach(prop => {
		assert.property(u, prop);
	});

	if (u.name === null) {
		assert.isString(u.email);
	}
	if (u.email === null) {
		assert.isString(u.name);
	}
	if (u.name === null && u.email === null) {
		assert.fail('One of "name" or "email" has to be set');
	}

	if (name) {
		assert.strictEqual(u.name, name);
	}
};
