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

import * as session from 'express-session';
import * as redis from 'redis';
import * as connectRedis from 'connect-redis';
import config from 'app/config';

const client = redis.createClient();
const redisStore = connectRedis(session);
const {host, port, ttl} = config.get('db.redis');

const secret = config.get('auth.session.secret');
const maxAge = config.get('auth.session.ttl') * 60 * 1000;  // Milliseconds

export const sessionConf = {
	store: new redisStore({
		host: host,
		port: port,
		client,
		ttl: ttl,
	}),
	secret,
	resave: false,
	saveUninitialized: false,
	cookie: {
		path: '/admin',
		secure: false,
		maxAge,
	},
};
