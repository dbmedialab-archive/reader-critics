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

import * as UsersActionsCreator from 'admin/actions/UsersActionsCreator';
import AdminConstants from 'admin/constants/AdminConstants';
import * as UIActions from 'admin/actions/UIActions';
import Api from 'admin/services/Api';
import * as PaginationActions from 'admin/actions/PaginationActions';
import * as ArticlesActions from 'admin/actions/ArticlesActions';
import * as ArticlesActionsCreator from 'admin/actions/ArticlesActionsCreator';

/**
 * Create || Update User in DB
 * @param user
 */
export function saveUser(user) {
	Api.saveUser(user).then((response) => {
		if (!user.ID){
			this.addUser(response);
		}else{
			this.editUser(user);
		}
	});
	UIActions.closeReset(AdminConstants.USER_MODAL_NAME);
}

/**
 * Fetch Users from DB
 */
export function getUsers(page?, limit?, sort?, sortOrder?, search?) {
	UIActions.showMainPreloader();
	Api.getUsers(page, limit, sort, sortOrder, search)
		.then((response) => {
			if (typeof response !== 'undefined') {
				MainStore.dispatch(UsersActionsCreator.getUsers(response.users));
				PaginationActions.setPageCount(response.pages);
				UIActions.hideMainPreloader();
			}
		})
		.catch((error) => UIActions.hideMainPreloader());
}

export function getEditors() {
	UIActions.showMainPreloader();
	Api.getEditors()
		.then((response) => {
			if (typeof response !== 'undefined') {
				MainStore.dispatch(UsersActionsCreator.getUsers(response));
				UIActions.hideMainPreloader();
			}
		})
		.catch((error) => UIActions.hideMainPreloader());
}

export function editUser(user) {
	MainStore.dispatch(UsersActionsCreator.editUser(user));
}

/**
 * Delete User by ID
 * @param user
 */
export function deleteUser(user) {
	UIActions.showMainPreloader();
	Api.deleteUser(user)
		.then(()=> MainStore.dispatch(
			UsersActionsCreator.deleteUser(user)
		))
		.then((error) => UIActions.hideMainPreloader());
}

export function addUser(user) {
	MainStore.dispatch(
		UsersActionsCreator.addUser(user)
	);
}

export function clear() {
	MainStore.dispatch(
		UsersActionsCreator.clear()
	);
}
