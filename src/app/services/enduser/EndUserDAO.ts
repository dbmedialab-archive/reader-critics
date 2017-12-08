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

import {
	isNil,
	isString
} from 'lodash';

import EndUser from 'base/EndUser';

import {
	EndUserDocument,
	EndUserModel
} from 'app/db/models';

import {
	wrapFindOne,
	wrapSave,
} from 'app/db/common';

import emptyCheck from 'app/util/emptyCheck';

import { anonymousEndUser } from 'app/services/enduser/EndUserService';

export const isParamEmpty = v => isNil(v) || (isString(v) && v.length <= 0);

/**
 * Fetch an EndUser object from the database. Opposite to system users (@see User)
 * an end user can be completely anonymous, because the frontend does not force
 * users to give their name and e-mail address.
 * With both parameters (name and email) empty, the function retrieves the
 * common "Anonymous" user object. Should this object not exist in the database
 * yet, the function will create a new object there and return it.
 *
 * @param name string
 * @param email string
 */
export function get(name? : string|null, email? : string|null) : Promise <EndUser> {
	const isAnonymous = isParamEmpty(name) && isParamEmpty(email);
	let query : any = {};

	if (isAnonymous) {
		query = {
			name: anonymousEndUser,
		};
	}
	else {
		if (!isParamEmpty(name)) {
			query.name = name;
		}
		if (!isParamEmpty(email)) {
			query.email = email;
		}
	}

	return wrapFindOne<EndUserDocument, EndUser>(EndUserModel.findOne(query))
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

export function save(enduser : EndUser) : Promise <EndUser> {
	emptyCheck(enduser);
	return wrapSave<EndUser>(new EndUserModel(enduser).save());
}
