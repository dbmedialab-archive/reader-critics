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

// tslint:disable:max-line-length
'use strict';

import * as Joi from 'joi-browser';
import Validation from 'base/Validation';

class Validator extends Validation {
	//Users
	userName = {
		schema: Joi.string().regex(/^[a-zA-Z0-9-.\\/_\s\u00C6\u00D8\u00C5\u00E6\u00F8\u00E5]{1,50}$/),
		message: 'User name should contain only alphanumeric characters, dash, underscore!',
	};

	userType = {
		schema: Joi.number().integer().min(1).max(3),
		message: 'Choose proper user role!',
	};

	userMail = {
		schema: Joi.string().regex(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
		message: 'User mail should be valid email address!', //'Skriv inn gyldig e-postadresse.'
	};
}

export default Validator;
