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

import { enduserService } from 'app/services';
import { defaultLimit } from 'app/services/BasicPersistingService';
import { anonymousEndUser } from 'app/services/enduser/EndUserService';
import { EmptyError } from 'app/util/errors';

import * as app from 'app/util/applib';

const demoUsers = path.join('resources', 'user', 'demo-endusers.json5');

// Main test function

export default function(this: ISuiteCallbackContext) {
	this.slow(250);

	testParameterChecks();
	testClear();
	testSave();
	testCount();

	testGet();
	testGetRange();

	testAnonymousSave();
	testAnonymousGet();
}

// Test runtime data

let userCount : number;

// Check for thrown exceptions

const testParameterChecks = () => it('parameter checks', () => {
	// No checks for empty parameters to get() will be here, because this
	// function returns the "Anonymous" user if all parameters are empty.
	// This anonymous user is created in the get() function, should it not
	// exist in the current database.
	// But at least we can test for some parameter combinations here:
	assert.doesNotThrow(() => enduserService.get('Jake Peralta'), Error);
	assert.doesNotThrow(() => enduserService.get(null, 'det.peralta@99prec.nyc'), Error);

	assert.throws(() => enduserService.save(null), EmptyError);
});

// enduserService.clear()

const testClear = () => it('clear()', () => enduserService.clear());

// enduserService.save()

const testSave = () => it('save()', () => app.loadJSON(demoUsers).then(data => {
	assert.isArray(data);
	userCount = data.length;

	return Promise.mapSeries(data, enduserService.save);
})
.then((results : EndUser[]) => {
	assert.isArray(results);
	assert.lengthOf(results, userCount, 'Number of saved objects does not match');

	results.forEach(u => assertUserObject(u));
}));

// enduserService.count()

const testCount = () => it('count()', () => enduserService.count().then(count => {
	assert.strictEqual(count, userCount);
}));

// enduserService.get()

const testGet = () => it('get()', () => {
	return Promise.all([
		enduserService.get('Indiana Horst'),
		enduserService.get(null, 'prost.mahlzeit@lulu.org'),
	//	enduserService.get('Ernst Eisenbichler', 'ee@aller.com'),
	]).then((results : EndUser[]) => {
		results.forEach(u => assertUserObject(u));
	});
});

// enduserService.getRange()

const testGetRange = () => it('getRange()', () => {
	const testLimit = 5;

	return Promise.all([
		// #1 should return the lesser of "defaultLimit" or "websiteCount" number of items:
		enduserService.getRange(),
		// #2 should return exactly "testLimit" items:
		enduserService.getRange(0, testLimit),
		// #3 skipping past the number of stored items should yield an empty result:
		enduserService.getRange(userCount),
	])
	.spread((...ranges : EndUser[][]) => {
		ranges.forEach(result => {
			assert.isArray(result);
			result.forEach(item => assertUserObject(item));
		});

		const lengthCheck = [
			Math.min(userCount, defaultLimit),
			testLimit,
			0,
		];

		ranges.forEach((result : EndUser[], index : number) => {
			assert.lengthOf(
				result,
				lengthCheck[index],
				`Incorrect number of objects in test range #${index + 1}`
			);
		});
	});
});

// Anonymous user

const testAnonymousSave = () => it('anonymous save()', () => enduserService
	.save({ name: null, email: null })
	.then(() => assert.fail())
	.catch(() => assert.ok(true))
);

const testAnonymousGet = () => it('anonymous get()', () => enduserService
.get(null, null)
.then((u : EndUser) => assertUserObject(u, anonymousEndUser))
);

// Generic structure check

const assertUserObject = (u : EndUser, name? : string) => {
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
