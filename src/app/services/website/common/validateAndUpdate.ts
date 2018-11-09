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
	SchemaValidationError,
} from 'app/util/errors';

import Website from 'base/Website';
import {websiteService} from 'app/services';
import {emailRegexp} from 'base/ValidationCustomValidations';

// Validate and store to database

export default function(name: string, data : any) : Promise <Website> {
	try {
		validateSchema(data);
	}
	catch (error) {
		return Promise.reject(error);
	}

	return websiteService.update(name, data);
}

// Schema Validator

function validateSchema(data : any) {
	// TODO see RC-110 for schema validation
	if (!isObject(data)) {
		throw new SchemaValidationError('Invalid feedback data');
	}
	const dataArrays: string[] = ['hosts', 'chiefEditors', 'sectionEditors'];
	const overrideArrays: string[] = ['feedbackEmail', 'fallbackFeedbackEmail', 'escalationEmail'];

	dataArrays.forEach((item: string) =>
		arrayValidation(
			`Invalid website data: "${item}" must be an array`,
			item,
			data));

	if (data.overrideSettings && data.overrideSettings.overrides) {
		overrideArrays.forEach(item => arrayOfEmailsValidation(item, data.overrideSettings.overrides));
	}
}

function arrayValidation (errText: string, item: any, data: any) {
	if (item in data && (!data[item] || !Array.isArray(data[item]))) {
		throw new SchemaValidationError(errText);
	}
}

function emailValidation (errText: string, item: string) {
	const test = emailRegexp.test(item);
	if (!test) {
		throw new SchemaValidationError(errText);
	}
}

function arrayOfEmailsValidation (item: any, data: any) {
	if (item in data) {
		if (!data[item] || !Array.isArray(data[item])) {
			throw new SchemaValidationError(
				`Invalid website data: "overrideSettings.overrides.${item}" must be an array`
			);
		}
		data[item].forEach((email: string) =>
			emailValidation(
			`Invalid website data: "overrideSettings.overrides.${item}" must contain valid emails`,
				email));
	}
}
