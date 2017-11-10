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

import Pagination from 'base/Pagination';
import {defaultLimit} from 'app/services/BasicPersistingService';

/**
 * Capitalize first letter in string
 * @param str
 * @returns {string}
 */
export function capitalizeFirstLetter(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Returns pagination params from location
 */
export function getPaginationParams (search: string): Pagination {
	const query = new URLSearchParams(search);

	return {
		page: parseInt(query.get('page')) || 1,
		limit: parseInt(query.get('limit')) || defaultLimit,
		sort: query.get('sort'),
		sortOrder: parseInt(query.get('sortOrder')),
	};
}

export function getFormattedPagination(
	page?: number,
	limit?: number,
	sort?: string,
	sortOrder?: number
) {
	const query = new URLSearchParams();
	if (page && page > 0) {
		query.append('page', page.toString());
	}
	if (typeof limit === 'number') {
		query.append('limit', limit.toString());
	}
	if (sort && typeof sortOrder !== 'undefined') {
		query.append('sort', sort);
		query.append('sortOrder', sortOrder.toString());
	}

	return query.toString() ? `?${query.toString()}` : '';
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function debounce(func, wait, immediate) {
	let timeout;
	return function(...args) {
		const later = () => {
			timeout = null;
			if (!immediate) {
				func.apply(this, args);
			}
		};
		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) {
			func.apply(this, args);
		}
	};
}
