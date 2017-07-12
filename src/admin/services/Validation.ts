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
