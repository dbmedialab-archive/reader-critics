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

import Users from 'base/Users';
import * as Immutable from 'seamless-immutable'	;
import * as  UsersActionsCreator  from 'admin/actions/UsersActionsCreator';
import * as UserConstants from '../constants/UserConstants';

interface UsersInit extends Users {
	users: Users[];
}

const initialState = Immutable.from<UsersInit>({
	users: [
		{
			'ID': '5964e04c6a2f9c5fae26625c',
			'email': 'valo44n1x@gmail.com',
			'role': 'admin',
			'name': 'Valeriy',
		},
	],
});

function receiveUsers(action, state) {
	const users = action.payload;
	if (!users.length) {
		return state;
	}
	return state.merge({users: action.payload});
}

function deleteUser(action, state) {
	let users = [];
	const userId = action.payload;
	const mutableArray = Immutable.asMutable(state.users);
	users = Immutable(mutableArray.filter(user => user.id !== userId));
	return { ...state, users };
}

function addUser(action, state) {
	const user = action.payload.data;
	let users = state.users;
	if (user) {
		const mutableArray = Immutable.asMutable(users);
		mutableArray.push(user);
		users = Immutable(mutableArray);
	}
	return { ...state, users };
}

function saveUser(action, state) {
	const user = action.payload;
	return {...state, user};
}

function editUser(action, state) {
	const userId = action.payload.id;
	const userIndex = state.users.findIndex(user => user.id === userId);
	const mutableUsers = Immutable.asMutable(state.users);
	mutableUsers[userIndex] = action.payload;
	const users = Immutable(mutableUsers);
	return {...state, users};
}

function UsersReducer(state: Users = initialState, action: UsersActionsCreator.TAction): Users {
	switch (action.type) {
		case UserConstants.USERS_RECEIVED:
			return receiveUsers(action, state);
		case UserConstants.DELETE_USER:
			return deleteUser(action, state);
		case UserConstants.EDIT_USER:
			return editUser(action, state);
		case UserConstants.SAVE_USER:
			return saveUser(action, state);
		case UserConstants.ADD_USER:
			return addUser(action, state);
		default:
			return state;
	}
}

export default UsersReducer;
