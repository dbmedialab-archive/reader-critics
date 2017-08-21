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

import User from 'base/User';
import Users from 'base/Users';
import UserRole from 'base/UserRole';
import * as Immutable from 'seamless-immutable';
import * as  UserActionsCreator  from 'admin/actions/UserActionsCreator';
import AdminConstants from 'admin/constants/AdminConstants';

interface UsersInit extends User, Users {
	users: Users[];
}

const initialState = Immutable.from<UsersInit>({
	name: '',
	email: '',
	role: UserRole.Normal,
});

function updateUser(action, state) {
	return state.merge({
		name: action.payload.name,
		email: action.payload.email,
		role: action.payload.role,
	});
}

function deauthenticateUser(action, state) {
	return state.merge({
		name: '',
		email: '',
		role: UserRole.Normal,
	});
}

function UserReducer(state: User = initialState, action: UserActionsCreator.TAction): User {
	switch (action.type) {
		case AdminConstants.AUTHENTICATE_USER:
			return updateUser(action, state);
		case AdminConstants.DEAUTHENTICATE_USER:
			return deauthenticateUser(action, state);
		case AdminConstants.UPDATE_CURRENT_USER:
			return updateUser(action, state);
		default:
			return state;
	}
}

export default UserReducer;
