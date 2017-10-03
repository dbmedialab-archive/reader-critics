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

import * as React from 'react';

import {
	diff,
	DiffConcatFn,
	DiffFormatFn,
	DiffHasLenFn,
} from './diff';

export default function (oldText : string, newText : string) : JSX.Element[] {
	const html : JSX.Element[] = [];

	// Define all callbacks. They are inlined in this function because
	// they need to have closure over the local "plain" variable.
	const formatFn : DiffFormatFn = (txtbit, index) => {
		if (typeof txtbit === 'string') {
			return <span key={index}>{txtbit.trim()}</span>;
		}

		if (txtbit.added === true) {
			return <ins key={index}>{txtbit.value.trim()}</ins>;
		}
		if (txtbit.removed === true) {
			return <del key={index}>{txtbit.value.trim()}</del>;
		}

		return <span key={index}>{txtbit.value.trim()}</span>;
	};

	const concatFn : DiffConcatFn = (formattedElem : any) => {
		html.push(formattedElem);
	};

	const hasLenFn : DiffHasLenFn = () => html.length > 0;

		// Calculate the diff and get the result data
	diff(oldText, newText, formatFn, concatFn, hasLenFn);

	return html;
}
