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
import * as Immutable from 'seamless-immutable';
import * as UsersActionsCreator from 'admin/actions/UsersActionsCreator';
import UserConstants from 'admin/constants/UserConstants';
import * as mergers from 'seamless-immutable-mergers';

const mergeConfig = {
	merger: mergers.updatingByIdArrayMerger,
	mergerObjectIdentifier: 'ID',
};

interface UsersInit {
	users: User[];
}

const initialState = Immutable.from <UsersInit> ({
	users: [],
});

function receiveUsers(action, state) {
	return state.merge({users: action.payload}, {deep: true});
}

function deleteUser(action, state) {
	const users = state.getIn(['users']);
	const userId = action.payload;
	const newUsers = Immutable.flatMap(users, (value) => {
		if (value.ID === userId) {
			return [];
		} else {
			return value;
		}
	});
	return Immutable.set(state, 'users', newUsers);
}

function addUser(action, state) {
	const user = action.payload;
	let users = state.getIn(['users']);
	if (user) {
		const mutableArray = Immutable.asMutable(users, {deep: true});
		mutableArray.push(user);
		users = Immutable(mutableArray);
	}
	return Immutable({ ...state, users });
}

function saveUser(action, state) {
	const user = action.payload;
	return Immutable({...state, user});
}

function editUser(action, state) {
	return state.merge({users: [action.payload]}, mergeConfig);
}

function UsersReducer(state: User[] = initialState, action: UsersActionsCreator.TAction): User[] {
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
