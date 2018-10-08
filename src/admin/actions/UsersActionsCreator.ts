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

import UserConstants from 'admin/constants/UserConstants';
import AdminConstants from 'admin/constants/AdminConstants';

export interface IAction {
	type: any;
	payload?: any;
}

export type TAction = IAction;

export function addUser(payload): IAction {
	return {
		type: UserConstants.ADD_USER,
		payload,
	};
}

export function getUsers(payload): IAction {
	return {
		type: UserConstants.USERS_RECEIVED,
		payload,
	};
}
export function deleteUser(payload): IAction {
	return {
		type: UserConstants.DELETE_USER,
		payload,
	};
}

export function editUser(payload): IAction {
	return {
		type: UserConstants.EDIT_USER,
		payload,
	};
}

export function clear(payload?): IAction {
	return {
		type: UserConstants.USER_LIST_CLEAR,
		payload,
	};
}
