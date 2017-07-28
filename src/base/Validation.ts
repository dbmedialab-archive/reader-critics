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

import * as inspector from 'schema-inspector';
import ValidationRules, {IValidationRule} from 'base/ValidationRules';

export interface IOptions {
	required?: Boolean;
}

export interface IValidation {
	validate(
		validationItem : { schema : string | IValidationRule; errorText? : string; },
		data : any, options: IOptions) : {
			isError : boolean,
			message : string
		};
}

export default class Validation implements IValidation {
	protected validationRules: {};
	private validator;

	constructor() {
		this.validator = inspector;
		this.validationRules = ValidationRules;
	}

	protected addValidationRules(rules) {
		Object.assign(this.validationRules, rules);
	}

	validate(validationItem, data, options:IOptions = {}) {
		let schema;
		const errorText = validationItem.errorText;
		const { required } = options;

		if (typeof validationItem === 'string') {
			schema = this.validationRules[validationItem];
		} else {
			schema = validationItem.schema;
		}

		if (!schema) {
			throw new Error('Validation schema is not valid');
		}

		schema.optional = !required;

		const validation = this.validator.validate(schema, data);
		return {
			isError: !validation.valid,
			message: errorText || validation.error[0],
		};
	}
}
