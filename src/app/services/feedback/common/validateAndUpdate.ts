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
	isArray,
	isObject,
	isString,
} from 'lodash';

import EndUser from 'base/EndUser';
import Feedback from 'base/Feedback';

import {
	enduserService,
	feedbackService,
} from 'app/services';

import {
	SchemaValidationError,
} from 'app/util/errors';

// Validate and store to database

export default function(id, data : any) : Promise <Feedback> {
	try {
		validateSchema(data);
	}
	catch (error) {
		return Promise.reject(error);
	}

	let enduser : EndUser;

	return Promise.all([
		getEndUser(data.user).then((u : EndUser) => enduser = u),
	])
	.then(() => feedbackService.update(id, enduser, data.items));
}

// Fetch user object from database or create a new one

function getEndUser(userData : any) : Promise <EndUser> {
	if (userData) {
		const name = isString(userData.name) ? userData.name : null;
		const email = isString(userData.email) ? userData.email : null;

		return enduserService.get(name, email)
			.then((u: EndUser) => u !== null ? u : enduserService.save({
				name,
				email,
			}));
	} else {
		return Promise.resolve(null);
	}
}

// Schema Validation

function validateSchema(data : any) {
	// TODO see RC-110 for schema validation
	if (!isObject(data)) {
		throw new SchemaValidationError('Invalid feedback data');
	}

	if ('user' in data && (!isObject(data.user) || isArray(data.user))) {
		throw new SchemaValidationError('Feedback data is missing or incorrect: "user"');
	}
	if ('items' in data && (!isArray(data.items))) {
		throw new SchemaValidationError('Feedback data is missing or incorrect: "items"');
	}

	if (!('user' in data) && !('items' in data)) {
		throw new SchemaValidationError('Feedback data is missing: send "items" and/or "user" objects');
	}
}
