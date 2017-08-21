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
import Validation from 'admin/services/Validation';
import * as moment from 'moment';
/**
 * Capitalize first letter in string
 * @param str
 * @returns {string}
 */
export function capitalizeFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Loops through array props and use Validation
 * @param data
 * @returns {boolean}
 */
/*export function isValidProps(data) {
	let error = false;
	for (let key in data){
		let valid = Validation.validate(key, data[key]);
		if (valid.isError){
			error = true;
		}
	}
	return error;
}*/

/**
 * @param createdAt
 * @param assignedAt
 * @returns {Object}
 */
export function deadLineTime(createdAt, assignedAt){
	const now = moment().format();
	moment(createdAt);
	moment(assignedAt);
	const days = createdAt.diff(assignedAt, 'days');
	const hours = createdAt.subtract(days, 'days').diff(assignedAt, 'hours');
	const minutes = createdAt.subtract(hours, 'hours').diff(assignedAt, 'minutes');
	return {
		days: createdAt.diff(assignedAt, 'days'),
		hours: createdAt.subtract(days, 'days').diff(assignedAt, 'hours'),
		minutes: createdAt.subtract(hours, 'hours').diff(assignedAt, 'minutes'),
	};
}
