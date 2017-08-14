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

import * as bcrypt from 'bcrypt';

import Person from 'base/zz/Person';
import User from 'base/User';

import {
	UserDocument,
	UserModel
} from 'app/db/models';

import {
	wrapFindOne,
	wrapSave,
} from 'app/db/common';

import emptyCheck from 'app/util/emptyCheck';

export function checkPassword(user : User, password : string) : Promise <boolean> {
	return UserModel.findOne({
		name: user.name,
		email: user.email,
	})
	.select('+password').exec().then((u : UserDocument) => {
		const hash = u.get('password');
		return hash === null ? Promise.resolve(false) : bcrypt.compare(password, hash);
	});
}

export function get(name : String, email? : String) : Promise <User> {
	emptyCheck(name);  // Do not check optional "email" parameter
	const query : any = { name };

	if (email !== undefined) {
		query.email = email;
	}

	// Better be paranoid about the password hash!
	return wrapFindOne<UserDocument, User>(UserModel.findOne(query).select('-password'));
}

export function getByEmail(email : String) : Promise <User> {
	emptyCheck(email);
	const query : any = { email: email };

	return wrapFindOne<UserDocument, User>(UserModel.findOne(query).select('-password'));
}

export function save(user : User) : Promise <User> {
	emptyCheck(user);
	return wrapSave<User>(new UserModel(user).save());
}

export function findOrInsert(user : Person) : Promise <User> {
	emptyCheck(user);
	return wrapFindOne(UserModel.findOneAndUpdate({
		name: user.name,
		email: user.email,
	},
	user,
	{
		upsert: true,
		new: true,
		setDefaultsOnInsert: true,
	}));
}
