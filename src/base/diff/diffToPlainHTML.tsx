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

import { isString } from 'lodash';

import {
	diff,
	DiffConcatFn,
	DiffFormatFn,
	DiffHasLenFn,
} from './diff';

export default function (oldText : string, newText : string) : string {
	let plain : string = '';

	// Define all callbacks. They are inlined in this function because
	// they need to have closure over the local "plain" variable.
	const formatFn : DiffFormatFn = (txtbit) => {
		if (isString(txtbit)) {
			return `<span>${txtbit.trim()}</span>`;
		}

		if (txtbit.added === true) {
			return `<ins>${txtbit.value.trim()}</ins>`;
		}
		if (txtbit.removed === true) {
			return `<del>${txtbit.value.trim()}</del>`;
		}

		return `<span>${txtbit.value.trim()}</span>`;
	};

	const concatFn : DiffConcatFn = (formattedElem : any) => {
		plain = plain.concat(formattedElem);
	};

	const hasLenFn : DiffHasLenFn = () => plain.length > 0;

	// Calculate the diff and get the result data
	diff(oldText, newText, formatFn, concatFn, hasLenFn);

	// Ship it!
	return plain;
}
