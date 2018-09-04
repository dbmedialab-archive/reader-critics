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

import config from 'app/config';
import User from 'base/User';
import emptyCheck from 'app/util/emptyCheck';

/**
 * Updates the password hash of a user in the database. All other properties of
 * the user object remain untouched. Keep in mind that this function takes a
 * significant amount of time to finish due to the BCrypt hashing and depending
 * on the number of configured hashing rounds. It is (officially, ny the authors
 * of the algorithm) recommended to configure at least as many rounds so that
 * the hashing takes not less that one second to complete on the target system.
 */
export function setPasswordHash (user : User, password : string) : Promise <User> {
	emptyCheck(user, password);
	return bcrypt.hash(password, config.get('auth.bcrypt.rounds'))
	.then(hash => Object.assign(user, { password: hash }) as User);
}
