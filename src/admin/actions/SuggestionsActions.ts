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

import MainStore from 'admin/stores/MainStore';
import Api from 'admin/services/Api';
import * as PaginationActions from 'admin/actions/PaginationActions';
import * as SuggestionsActions from 'admin/actions/SuggestionsActions';
import * as SuggestionsActionsCreator from 'admin/actions/SuggestionsActionsCreator';
import * as UIActions from 'admin/actions/UIActions';
import Suggestion from 'base/Suggestion';

export function setSuggestionsList (suggestions: Array<Suggestion>) {
	UIActions.hideMainPreloader();
	MainStore.dispatch(
		SuggestionsActionsCreator.setSuggestionsList(suggestions)
	);
}

export function getSuggestionsList (page?, limit?, sort?, sortOrder?) {
	UIActions.showMainPreloader();
	Api.getSuggestionsList(page, limit, sort, sortOrder)
		.then((resp) => {
			SuggestionsActions.setSuggestionsList(resp.suggestions);
			PaginationActions.setPageCount(resp.pageCount);
		});
}

export function clear () {
	MainStore.dispatch(
		SuggestionsActionsCreator.clear()
	);
}
