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

import AdminConstants from 'admin/constants/AdminConstants';

export interface IAction {
		type: any;
		payload?: any;
}

export type TAction = IAction;

export function setWebsiteList(payload): IAction {
	return {
		type: AdminConstants.WEBSITE_LIST_RECEIVED,
		payload,
	};
}

export function setSelectedWebsite(payload): IAction {
	return {
		type: AdminConstants.WEBSITE_SELECTED,
		payload,
	};
}

export function setWebsiteOptions(payload): IAction {
	return {
		type: AdminConstants.WEBSITE_OPTIONS_RECEIVED,
		payload,
	};
}

// Used for update data while new website creation
export function updateSelectedWebsite(payload): IAction {
	return {
		type: AdminConstants.WEBSITE_SELECTED_UPDATED,
		payload,
	};
}

export function addCreatedWebsite(payload): IAction {
	return {
		type: AdminConstants.WEBSITE_CREATED,
		payload,
	};
}

export function updateWebsiteList(payload): IAction {
	return {
		type: AdminConstants.WEBSITE_UPDATED,
		payload,
	};
}
