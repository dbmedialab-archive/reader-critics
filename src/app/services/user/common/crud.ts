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
	isEmpty,
	isObject,
} from 'lodash';
import * as bcrypt from 'bcrypt';

import {
	userService,
} from 'app/services';

import {
	SchemaValidationError,
} from 'app/util/errors';
import config from 'app/config';

/**
 * Validating input data and saving users
 */
export function validateAndSave (data: any): Promise<any> {
	try {
		validateSchema(data);
	}
	catch (error) {
		return Promise.reject(error);
	}

	return checkUniqueEmail(data.email)
		.then((unique: boolean) => {
			if (unique) {
				return hashPasswordAndGoThrough(data, userService.save.bind(null));
			} else {
				throw new SchemaValidationError('Email already exists in database');
			}
		});
}

/*
 * Validates amd updates user.
 * This doesn't allow to change user password.
 * Updating password will be separate procedure
 */
export function validateAndUpdate (id: String, data: any): Promise<any> {
	try {
		validateSchemaUpdate(data);
	}
	catch (error) {
		return Promise.reject(error);
	}
	return userService.getByID(id)
		.then(user => {
			if (!isEmpty(data.password)) {
				delete data.password;
			}

			if (data.email === user.email) {
				return hashPasswordAndGoThrough(data, userService.update.bind(null, id));
			} else {
				return checkUniqueEmail(data.email)
					.then((unique: boolean) => {
						if (unique) {
							return hashPasswordAndGoThrough(data, userService.update.bind(null, id));
						} else {
							throw new SchemaValidationError('Email already exists in database');
						}
					});
			}
		})
		.catch(err => {
			return Promise.reject(err);
		});
}

/**
 * Check if email is unique in database
 */
function checkUniqueEmail (userMail: string): Promise<boolean> {
	return userService.getByEmail(userMail)
					.then(user => user === null);
}

/**
 * Schema Validator
 */
function validateSchema (data: any) {
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

/*
 * Validating fileds when updating user entity
 */
function validateSchemaUpdate (data: any) {
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
}

function hashPasswordAndGoThrough (userData, cb) {
	if (userData.password !== undefined) {
		//hashing password
		return bcrypt.hash(userData.password, config.get('auth.bcrypt.rounds')).then((hash) => {
			userData.password = hash;
			return cb(userData);
		});
	} else {
		return cb(userData);
	}
}
