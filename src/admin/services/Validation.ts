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

'use strict';

import * as Joi from 'joi-browser';

const Validation = {
	validate: function(validationItem, data){
		const self = this;
		let schema,
			errorText = 'Validation error';
		if (typeof validationItem === 'string') {
			schema = self[validationItem].schema;
			errorText = self[validationItem].message;
		} else if (typeof validationItem === 'object'
				&& validationItem.schema
				&& validationItem.schema.isJoi) {
			schema = validationItem.schema;
			errorText = validationItem.message;
		}
		if (!schema) {
			throw new Error('Validation schema is not valid');
		}

		return Joi.validate(data, schema, function(error, value){
			const response = {
				isError: false,
				message: errorText,
			};
			if (error === null){
				return response;
			}
			response.isError = true;
			return response;
		});
	},
	//Users
	userName: {
		schema: Joi.string().regex(/^[a-zA-Z0-9-.\\/_\s\u00C6\u00D8\u00C5\u00E6\u00F8\u00E5]{1,50}$/),
		message: 'User name should contain only alphanumeric characters, dash, underscore!',
	},
	userType: {
		schema: Joi.number().integer().min(1).max(3),
		message: 'Choose proper user role!',
	},
	userMail: {
		schema: Joi.string().email(),
		message: 'User mail should be valid email address!',
	},
};

export default Validation;
