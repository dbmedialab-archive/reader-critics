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

import EndUser from 'base/EndUser';

import {
	EndUserDocument,
	EndUserModel
} from 'app/db/models';

import {
	wrapSave,
} from 'app/db/common';

import emptyCheck from 'app/util/emptyCheck';

import genericGetUser, { isEmpty } from '../user/dao/genericGetUser';

import { anonymousEndUser } from 'app/services/enduser/EndUserService';

/**
 * Fetch an EndUser object from the database. Opposite to system users (@see User)
 * an end user can be completely anonymous, because the frontend does not force
 * users to give their name and e-mail address.
 * With both parameters (username and email) empty, the function retrieves the
 * common "Anonymous" user object. Should this object not exist in the database
 * yet, the function will create a new object there and return it.
 *
 * @param username string
 * @param email string
 */
export function get(username : string|null, email? : string|null) : Promise <EndUser> {
	const isAnonymous = isEmpty(username) && isEmpty(email);

	return genericGetUser<EndUserDocument, EndUser>(
		EndUserModel,
		isAnonymous ? anonymousEndUser : username,
		isAnonymous ? null : email
	)
	.then((endUser : EndUser) => {
		if (endUser !== null) {
			return endUser;
		}

		if (isAnonymous) {
			return save({
				name: anonymousEndUser,
				email: null,
			});
		}

		return null;
	});
}

export function save(user : EndUser) : Promise <EndUser> {
	emptyCheck(user);
	return wrapSave<EndUser>(new EndUserModel(user).save());
}
