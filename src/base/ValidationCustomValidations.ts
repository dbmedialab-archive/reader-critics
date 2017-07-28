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

import UserRole from 'base/UserRole';
import * as _ from 'lodash';

export interface ICustomValidations {
	[index: string]: (schema: String, v: any) => void;
}

const validations = {
	isEmail: (schema: String, v:any) => {
		if (!/^[a-zA-Z0-9-.\\/_\s\u00C6\u00D8\u00C5\u00E6\u00F8\u00E5]{1,50}$/.test(v)) {
			this.report(`${schema} must me an email`);
		}
	},
	isUserRole: (schema: String, v:any) => {
		if (!_.includes(UserRole, v)) {
			this.report(`${schema} must be a valid user role`);
		}
	},
};

export default validations;
