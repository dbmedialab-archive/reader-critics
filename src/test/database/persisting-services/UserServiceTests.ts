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

import User from 'base/User';
import UserRole from 'base/UserRole';

import { defaultLimit } from 'app/services/BasicPersistingService';
import { userService } from 'app/services';
import { EmptyError } from 'app/util/errors';

import * as app from 'app/util/applib';

const demoUsers = path.join('resources', 'user', 'demo-users.json5');

export default function(this: ISuiteCallbackContext) {
	let userCount : number;

	it('parameter checks', () => {
		assert.throws(() => userService.get(null), EmptyError);
		assert.throws(() => userService.get(null, null), EmptyError);

		assert.throws(() => userService.get(''), EmptyError);
		assert.throws(() => userService.get('', ''), EmptyError);

		assert.doesNotThrow(() => userService.get('Jack Peralta'), Error);
		assert.doesNotThrow(() => userService.get(null, 'det.peralta@99prec.nyc'), Error);

		assert.throws(() => userService.save(null), EmptyError);
	});

	it('clear()', () => userService.clear());

	it('save()', () => app.loadJSON(demoUsers).then(data => {
		assert.isArray(data);
		userCount = data.length;

		return Promise.mapSeries(data, userService.save);
	})
	.then(results => {
		assert.isArray(results);
		assert.lengthOf(results, userCount, 'Number of saved objects does not match');
	}));

	it('count()', () => userService.count().then(count => {
		assert.strictEqual(count, userCount);
	}));

	it('get()', () => {
		return Promise.all([
			userService.get('Indiana Horst'),
			userService.get(null, 'prost.mahlzeit@lulu.org'),
			userService.get('Ernst Eisenbichler', 'ee@aller.com'),
		]).then((results : User[]) => {
			results.forEach(u => assertUserObject(u));
		});
	});

	it('checkPassword()', () => {
		return Promise.all([
			userService.get('Indiana Horst')
				.then(u => userService.checkPassword(u, 'nix')),
			userService.get('Ernst Eisenbichler')
				.then(u => userService.checkPassword(u, 'test123')),
			userService.get('Philipp Gröschler', 'philipp@sol.no')
				.then(u => userService.checkPassword(u, 'freshguacamole')),
		]).then((results : boolean[]) => {
			assert.isFalse(results[0]);
			assert.isTrue(results[1]);
			assert.isFalse(results[2]);
		});
	});

	it('getRange()', () => {
		const testLimit = 5;

		return Promise.all([
			// #1 should return the lesser of "defaultLimit" or "websiteCount" number of items:
			userService.getRange(),
			// #2 should return exactly "testLimit" items:
			userService.getRange(0, testLimit),
			// #3 skipping past the number of stored items should yield an empty result:
			userService.getRange(userCount),
		]).then((results : [User[]]) => {
			results.forEach(result => {
				assert.isArray(result);
				result.forEach(item => assertUserObject(item));
			});

			const lengthCheck = [
				Math.min(userCount, defaultLimit),
				testLimit,
				0,
			];

			results.forEach((result : User[], index : number) => {
				assert.lengthOf(
					result,
					lengthCheck[index],
					`Incorrect number of objects in test range #${index + 1}`
				);
			});
		});
	});
}

const assertUserObject = (u : User, noPassword = true, name? : string) => {
	assert.isObject(u);

	[ 'ID', 'name', 'email', 'role' ].forEach(prop => {
		assert.property(u, prop);
	});

	if (noPassword) {
		assert.notProperty(u, 'passwort');
	}

	if (u.name === null) {
		assert.isString(u.email);
	}
	if (u.email === null) {
		assert.isString(u.name);
	}
	if (u.name === null && u.email === null) {
		assert.fail('One of "name" or "email" has to be set');
	}

	assert.isString(u.role);
	assert.include(Object.values(UserRole), u.role);

	if (name) {
		assert.strictEqual(u.name, name);
	}
};
