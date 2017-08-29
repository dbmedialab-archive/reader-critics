//
// LESERKRITIKK v2 (aka Reader Critics)
// Copyright (C) 2017 DB Medialab/Aller Media AS, Oslo, Norway
// https://github.com/dbmedialab/reader-critics/
//
// This program is free software: you can redistribute it and/or modify it
// under
// the terms of the GNU General Public License as published by the Free
// Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
// details.  You should have received a copy of the GNU General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.
import Website from 'base/Website';
import * as Immutable from 'seamless-immutable';
import * as  WebsiteActionsCreator  from 'admin/actions/WebsiteActionsCreator';
import AdminConstants from 'admin/constants/AdminConstants';

export interface IWebsiteState {
	websites: Array<Website>;
	selected: Website | null;
	options: any | null;
}

const initialState: IWebsiteState = Immutable({
	websites: [],
	selected: null,
	options: {},
});

function setWebsites(action, state) {
	return state.merge({
		websites: action.payload,
	});
}

function setSelected(action, state) {
	return state.replace({
		selected: action.payload,
	}, {deep: true});
}

function updateSelected(action, state) {
	return state.merge({
		selected: action.payload,
	}, {deep: true});
}

function setOptions(action, state) {
	return state.merge({
		options: action.payload,
	});
}

function WebsiteReducer(
	state: IWebsiteState = initialState,
	action: WebsiteActionsCreator.TAction
	): IWebsiteState {

	switch (action.type) {
		case AdminConstants.WEBSITE_LIST_RECEIVED:
			return setWebsites(action, state);
		case AdminConstants.WEBSITE_SELECTED:
			return setSelected(action, state);
		case AdminConstants.WEBSITE_OPTIONS_RECEIVED:
			return setOptions(action, state);
		case AdminConstants.WEBSITE_SELECTED_UPDATED:
			return updateSelected(action, state);
		default:
			return state;
	}
}

export default WebsiteReducer;
