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

import * as Joi from 'joi-browser';

export interface IValidation {
	validate(
		validationItem : { schema : string; isJoi : boolean; } | string,
		data : string,
		options? : any ) : {
			isError : boolean,
			message : string
		};
}

export default class Validation implements IValidation {
	validate(validationItem, data, options = {}) {
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

		return Joi.validate(data, schema, options, function (error, value) {
			const response = {
				isError: false,
				message: errorText,
			};
			if (error === null) {
				return response;
			}
			response.isError = true;
			return response;
		});
	}

	//Suggestion-box
	suggestionComment = {
		schema: Joi.string().max(2000).required(),
		message: 'Tilbakemelding er for lang (maksimum 2000 tegn).',
	};
}
