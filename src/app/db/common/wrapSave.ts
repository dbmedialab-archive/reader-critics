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

import {
	Document,
} from 'mongoose';

import * as errors from 'app/db/errors';

import { filterMeta } from 'app/db/filter';

export function wrapSave <Z> (wrapped : Promise <Document>) : Promise <Z> {
	return wrapped.then((doc : Document) => filterMeta<Z>(doc.toObject()))
	.catch(error => Promise.reject(
		errors.isDuplicateError(error) ? new errors.DuplicateError(error) : error
	));
}
