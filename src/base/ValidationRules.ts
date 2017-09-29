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

/**
 * This file contains validation rules to pass to validator
 */

/**
 * To see a full list ov available props visit https://www.npmjs.com/package/schema-inspector
 * Note that exec param can also be an array of functions
 */
// import {ICustomValidations} from 'base/ValidationCustomValidations';

export interface IValidationRule {
	type: String | String[];
	// exec?: ICustomValidations | Array<ICustomValidations>;
	error?: String;
	[index: string]: any;
}

export interface IValidationRules {
	[index: string]: IValidationRule;
}

const ValidationRules: IValidationRules = {
	suggestionComment: {
		type: 'string',
		maxLength: 2000,
		error: 'Tilbakemelding er for lang (maksimum 2000 tegn).',
	},
};

export default ValidationRules;
