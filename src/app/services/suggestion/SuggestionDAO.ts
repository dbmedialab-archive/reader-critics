import { isValidDate } from 'app/util/applib';

import { Suggestion } from 'base/';

import {
	SuggestionDocument,
	SuggestionModel,
} from 'app/db/models';

import leanFilter from 'app/db/leanFilter';

export function findSince(since : Date) : Promise <Suggestion[]> {
	if (!isValidDate(since)) {
		return Promise.reject(new TypeError('Invalid date'));
	}

	return leanFilter <SuggestionDocument, Suggestion> (SuggestionModel.find({
		'date.created': {
			'$gte': since,
		},
	}).sort( { 'date.created': -1 } ));
}

export function save(suggestion : Suggestion) : Promise <void> {
	console.log('save', suggestion.email);
	return new SuggestionModel(suggestion).save().then(() => undefined);
}
