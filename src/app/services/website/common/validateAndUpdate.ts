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

import {
	isObject,
} from 'lodash';

import {
	NotFoundError,
	SchemaValidationError,
} from 'app/util/errors';

import Website from 'base/Website';
import {userService, websiteService} from 'app/services';
import User from 'base/User';

// Validate and store to database

export default function(name: string, data : any) : Promise <Website> {
	try {
		validateSchema(data);
	}
	catch (error) {
		return Promise.reject(error);
	}

	return Promise.all([])
	.then(() => websiteService.update(name, data));
}

// Fetch user object from database or create a new one

// function getUsers(userData : any) : Promise <User> {
// 	const name = isString(userData.name) ? userData.name : null;
// 	const email = isString(userData.email) ? userData.email : null;
//
// 	return userService.get(name, email)
// 	.then((u : User) => u !== null ? u : enduserService.save({
// 		name,
// 		email,
// 	}));
// }

// Schema Validation

function validateSchema(data : any) {
	// TODO see RC-110 for schema validation
	if (!isObject(data)) {
		throw new SchemaValidationError('Invalid feedback data');
	}
	if ('hosts' in data && !data.hosts && !Array.isArray(data.hosts)) {
		throw new SchemaValidationError('Invalid website data: hosts must be an array');
	}
	if ('chiefEditors' in data && !data.chiefEditors && !Array.isArray(data.chiefEditors)) {
		throw new SchemaValidationError('Invalid website data: chiefEditors must be an array');
	}
}
