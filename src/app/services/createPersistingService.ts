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
	wrapFind,
} from 'app/db/common';

import { isTest } from 'app/util/applib';

import BasicPersistingService, {
	defaultLimit,
	defaultSkip,
	defaultSort,
} from './BasicPersistingService';

// Default implementations

class BasicPersistingServiceImpl <
	T extends Document,
	X extends BasicPersistingService <Y>,
	Y
> {
	protected serviceModel : Model <T>;

	constructor(serviceModel : Model <T>) {
		console.log('constructor BasicPersistingServiceImpl');
		this.serviceModel = serviceModel;
	}

	public clear() : Promise <void> {
		if (!isTest) {
			throw new Error('Function can only be used in TEST mode');
		}
		return clearCollection(this.serviceModel);
	}

	public count () : Promise <number> {
		return getCount(this.serviceModel);
	}

	public getRange (
		skip : number = defaultSkip,
		limit : number = defaultLimit,
		sort : Object = defaultSort
	) : Promise <Y[]> {
		console.log('getRange.this', this);
		return wrapFind<T, Y>(
			this.serviceModel.find()
			.sort(sort).skip(skip).limit(limit)
		);
	}
}

export default function <T extends Document, X extends BasicPersistingService <Y>, Y> (
	serviceModel : Model <T>,
	serviceFunctions : any
) : X
{
	const ServiceClass = function() {
		console.log('constructor ServiceClass');
		// BasicPersistingServiceImpl.constructor.call(this);
		Function.prototype.bind.call(BasicPersistingServiceImpl.constructor, this);
	};

	// subclass extends superclass
	ServiceClass.prototype = Object.create(BasicPersistingServiceImpl.prototype);
	ServiceClass.prototype.constructor = BasicPersistingServiceImpl;

	Object.assign(ServiceClass, serviceFunctions);

	const impl = new ServiceClass();
	return <X> impl;
}

/*
export default function <T extends Document, X extends BasicPersistingService <Y>, Y> (
	serviceModel : Model <T>,
	serviceFunctions : Object
) : X
{
	const basicFunctions : BasicPersistingService <Y> = {
		clear: () : Promise <void> => {
			if (!isTest) {
				throw new Error('Function can only be used in TEST mode');
			}
			return clearCollection(serviceModel);
		},

		count: () : Promise <number> => getCount(serviceModel),

		getRange: (
			skip : number = defaultSkip,
			limit : number = defaultLimit,
			sort : Object = defaultSort
		) : Promise <Y[]> => {
			console.log('getRange.this', this.default);
			return wrapFind<T, Y>(
				serviceModel.find()
				.sort(sort).skip(skip).limit(limit)
			);
		},
	};

	return <X> Object.assign(basicFunctions, serviceFunctions);
}
*/
