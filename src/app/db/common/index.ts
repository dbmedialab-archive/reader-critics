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
	Schema,
} from 'mongoose';

import { ObjectID } from 'app/db';
import { isTest } from 'app/util/applib';

export {
	wrapFind,
	wrapFindOne,
} from './wrapFind';

export { wrapSave } from './wrapSave';

export function clearCollection <T extends Document> (model : Model <T>) : Promise <void> {
	if (isTest) {
		return model.remove({})
		.then(() => model.collection.dropIndexes())
		.then(() => undefined);
	}
	throw new Error('Function can only be used in TEST mode');
}

export function getCount <T extends Document> (model : Model <T>) : Promise <number> {
	return model.count({}).then(result => Promise.resolve(result));
}

export const objectReference = (
	modelName : string,
	options : {
		required? : boolean,
		select? : boolean,
	} = {
		required: true,
		select: true,
	}
) : Object => Object.assign(options, {
	type: Schema.Types.ObjectId,
	ref: modelName,
	set: (id : string) : ObjectID => new ObjectID(id),
});
