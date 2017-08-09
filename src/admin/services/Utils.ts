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
