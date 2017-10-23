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

import { createRedisConnection } from 'app/db';
import { dbSessionCache } from 'app/db/createRedisConnection';

import config from 'app/config';

export const secret : string = config.get('auth.session.secret');
export const maxAge : number = config.get('auth.session.ttl') * 60 * 1000;  // Milliseconds

export const getSessionConfig = () => ({
	client: createRedisConnection (dbSessionCache) as {},
	secret,
	resave: false,
	saveUninitialized: false,
	cookie: {
		path: '/admin',
		secure: false,
		maxAge,
	},
});
