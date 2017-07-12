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

import { isValidDate } from 'app/util/applib';
import { Suggestion } from 'base/';

import {
	SuggestionDocument,
	SuggestionModel,
} from 'app/db/models';

import {
	clearCollection,
	wrapFind,
	wrapSave
} from 'app/db/common';

import { isTest } from 'app/util/applib';

export function clear() : Promise <void> {
	return clearCollection(SuggestionModel);
}

export function findSince(since : Date) : Promise <Suggestion[]> {
	if (!isValidDate(since)) {
		return Promise.reject(new TypeError('Invalid date'));
	}

	return wrapFind <SuggestionDocument, Suggestion> (SuggestionModel.find({
		'date.created': {
			'$gte': since,
		},
	}).sort( { 'date.created': -1 } ));
}

export function save(suggestion : Suggestion) : Promise <void> {
	return wrapSave(new SuggestionModel(suggestion).save());
}
