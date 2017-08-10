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
import User from 'base/User';

import * as UserActionsCreator from 'admin/actions/UserActionsCreator';
import AdminConstants from 'admin/constants/AdminConstants';
import * as UIActions from 'admin/actions/UIActions';
import * as apiAdminCommunication from 'admin/apiAdminCommunication';

export function authenticate(user: User) {
	MainStore.dispatch(
		UserActionsCreator.authenticateUser(user)
	);
}
export function deauthenticate() {
	MainStore.dispatch(
		UserActionsCreator.deauthenticateUser()
	);
}

export function update(user: User) {
	MainStore.dispatch(
		UserActionsCreator.updateUser(user)
	);
}

/**
 * Create || Update User in DB
 * @param user
 */
export function saveUser(user) {
	apiAdminCommunication.saveUser(user).then((response) => {
		if (!user.id){
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
export function getUsers() {
	UIActions.showMainPreloader();
	apiAdminCommunication.getUsers()
		.then((response) => {
			console.log(response);
			if (typeof response !== 'undefined'){
				MainStore.dispatch(UserActionsCreator.getUsers(response));
				UIActions.hideMainPreloader();
			}
		})
		.catch((error) => UIActions.hideMainPreloader());
}

export function editUser(user) {
	MainStore.dispatch(UserActionsCreator.editUser(user));
}

/**
 * Delete User by ID
 * @param user
 */
export function deleteUser(user) {
	UIActions.showMainPreloader();
	console.log(user);
	UserActionsCreator.deleteUser(user);
	apiAdminCommunication.deleteUser(user).then(
		MainStore.dispatch(
			UserActionsCreator.deleteUser(user)
		))
		.then((error) => UIActions.hideMainPreloader());
}

export function addUser(user) {
	MainStore.dispatch(
		UserActionsCreator.addUser(user)
	);
}
