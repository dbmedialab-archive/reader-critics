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

import * as Immutable from 'seamless-immutable';
import * as  PaginationActionsCreator  from 'admin/actions/PaginationActionsCreator';
import AdminConstants from 'admin/constants/AdminConstants';

export interface IPaginationState {
	pageCount: number;
}

const initialState: IPaginationState = Immutable({
	pageCount: 1,
});

function setPageCount(action, state) {
	return state.merge({
		pageCount: action.payload || 1,
	});
}

function clear(action, payload) {
	return initialState;
}

function PaginationReducer(
	state: IPaginationState = initialState,
	action: PaginationActionsCreator.TAction
): IPaginationState {

	switch (action.type) {
		case AdminConstants.PAGINATION_CLEAR:
			return clear(action, state);
		case AdminConstants.PAGINATION_RECEIVED:
			return setPageCount(action, state);
		default:
			return state;
	}
}

export default PaginationReducer;
