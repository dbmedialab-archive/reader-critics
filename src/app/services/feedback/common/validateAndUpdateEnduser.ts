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
	isString,
} from 'lodash';

import EndUser from 'base/EndUser';
import Feedback from 'base/Feedback';

import {
	enduserService,
	feedbackService,
} from 'app/services';

import { SchemaValidationError } from 'app/util/errors';

/**
 * Intermediate type for internal use, used between validation and persistence.
 */
type RawUpdateData = {
	token : string
	name : string
	email : string
};

/**
 * Validate enduser data and store it on a feedback object
 */
export function validateAndUpdateEnduser(data : {}) : Promise <Feedback> {
	// Once again, wrapping this into a promise because TypeScript has problems
	// with the return type of Bluebird's spread() function
	return new Promise((resolve, reject) => {
		validateSchema(data)

		.then((updateData : RawUpdateData) => Promise.all([
			getFeedback(updateData),
			getEndUser(updateData),
		]))

		.spread(feedbackService.updateEndUser)

		.then((feedback : Feedback) => resolve(feedback))
		.catch(error => reject(error));
	});
}

function getFeedback(data : RawUpdateData) : Promise <Feedback> {
	return feedbackService.getByUpdateToken(data.token);
}

function getEndUser(data : RawUpdateData) : Promise <EndUser> {
	const name = trimUserData(data.name);
	const email = trimUserData(data.email);

	return enduserService.get(name, email)
	.then((foundUser : EndUser) => {
		if (foundUser !== null) {
			return foundUser;
		}

		const newUser : EndUser = {
			name,
			email,
		};

		return enduserService.save(newUser);
	});
}

function validateSchema(data : {}) : Promise <RawUpdateData> {
	if (!isObject(data)) {
		return Promise.reject(new SchemaValidationError(
			'Invalid feedback data'
		));
	}
	if (!isString(data['token'])) {
		return Promise.reject(new SchemaValidationError(
			'Update data is missing "token" string'
		));
	}

	return Promise.resolve(data as RawUpdateData);
}

function trimUserData(a : string) : string | null {
	const b = a.trim();
	return b === '' ? null : b;
}
