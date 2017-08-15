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
	isEmpty,
} from 'lodash';

import {
	userService,
} from 'app/services';

import {
	SchemaValidationError,
} from 'app/util/errors';

/**
 * Validating input data and saving users
 */
export default function(data : any) : Promise <any> {
	try {
		validateSchema(data);
	}
	catch (error) {
		return Promise.reject(error);
	}

	return checkUniqueEmail(data.email)
	.then((unique : boolean) => {
		if (unique) {
			return userService.save(data);
		} else {
			throw new SchemaValidationError('Email already exists in database');
		}
	});
}

/**
 * Check if email is unique in database
 */
function checkUniqueEmail(userMail : string) : Promise <boolean> {
	return userService.getByEmail(userMail)
	.then(user => user == null);	
}


/**
 * Schema Validation
 */
function validateSchema(data : any) {
	// TODO see RC-110 for schema validation
	if (!isObject(data)) {
		throw new SchemaValidationError('Invalid user data');
	}

	if (isEmpty(data.email)) {
		throw new SchemaValidationError('Email field is required');
	}
	
	if (isEmpty(data.name)) {
		throw new SchemaValidationError('Name field is required');
	}
	
	if (isEmpty(data.role)) {
		throw new SchemaValidationError('Role field is required');
	}
	
	if (isEmpty(data.password)) {
		throw new SchemaValidationError('Password field is required');
	}
}
