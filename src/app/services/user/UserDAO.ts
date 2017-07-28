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

import { isNil, isString } from 'lodash';

import User from 'base/User';

import { UserModel } from 'app/db/models';

import {
	wrapFindOne,
	wrapSave,
} from 'app/db/common';

import emptyCheck from 'app/util/emptyCheck';

import { EmptyError } from 'app/util/errors';

import * as app from 'app/util/applib';

const isEmpty = (v) => isNil(v) ? true : (isString(v) && v.length <= 0);

export function get(username : String|null, email? : String|null) : Promise <User> {
	if (isEmpty(username) && isEmpty(email)) {
		throw new EmptyError('At least one of "username" or "email" must be set');
	}

	const query : any = {};

	if (isString(username)) {
		query.name = username;
	}
	if (isString(email)) {
		query.email = email;
	}

	return wrapFindOne(UserModel.findOne(query));
}

	//Users.findOne({_id: id}).select('+password').exec(...);

export function save(user : User) : Promise <void> {
	emptyCheck(user);
	return wrapSave(new UserModel(user).save());
}

/*
public comparePassword(password: string, cb: (err: string, isMatch: boolean) => void): void {
	bcrypt.compare(password, this.password, cb);
}

bcrypt.compare(myPlaintextPassword, hash).then(function(res) {
    // res == true
});
*/
