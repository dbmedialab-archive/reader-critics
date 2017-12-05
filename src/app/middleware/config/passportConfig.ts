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
import { userService } from 'app/services';

export type SerializeCallback = (err : string|null, username : string|null) => void;
export type RetrieveCallback = (err : string|null, user? : User) => void;

export { localStrategy } from './strategy/local';

export function serializeUser(user : User, done: SerializeCallback) {
	done(null, user.name);
}

export function deserializeUser(username : string, done : RetrieveCallback) {
	userService.get(username).then((user : User) => {
		done(user === null ? 'User not found' : null, user);
	});
}
