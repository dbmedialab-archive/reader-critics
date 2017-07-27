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
	Model,
} from 'mongoose';

import {
	clearCollection,
	getCount,
} from 'app/db/common';

import { isProduction } from 'app/util/applib';

import BasicPersistingService from './BasicPersistingService';

// Default implementations

export default function <T extends Document, X extends BasicPersistingService <Y>, Y> (
	serviceModel : Model <T>,
	serviceFunctions : Object
) : X
{
	const basicFunctions : BasicPersistingService <Y> = {
		clear: () : Promise <void> => {
			if (isProduction) {
				throw new Error('Function can only be used in TEST mode');
			}
			return clearCollection(serviceModel);
		},

		count: () : Promise <number> => getCount(serviceModel),

		// getRange : (skip : number, limit : number, sort? : Object) : Promise <Y[]> => {
		// 	return Promise.resolve([]);
		// },
	};

	return <X> Object.assign(basicFunctions, serviceFunctions);
}
