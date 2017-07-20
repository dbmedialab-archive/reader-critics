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

import * as convict from 'convict';
import User from './models/User';

const config = convict({
	http: {
		port: {
			doc: 'Network port where the HTTP server is going to listen',
			format: 'port',
			default: 4000,
			env: 'HTTP_PORT',
		},
	},
	mongodb: {
		url: {
			doc: 'MongoDB connection URL for the main backend database',
			default: 'mongodb://localhost:27017/readercritics',
			env: 'MONGODB_URL',
		},
	},
	jwt: {
		// TODO something with multi-threading for secret with crypto
		jwtSecret: '0edeeb08eef4689cf52f8401f87ddaae97b3e31f24032a1a2a4f66fae8841c98',
		jwtDuration: '2 hours',
		session: true,
		env: 'JWT',
	},
	redis: {
		url: {
			doc: 'Redis URL to connect to (including auth string)',
			default: 'redis://localhost:6379',
			env: 'REDIS_URL',
		},
		host: 'localhost',
		port: 6379,
		ttl: 260,
	},
	// TODO remove it on DB added
	users: [
		new User({name: 'admin', login: 'admin', password: 'test'}),
	],
});

config.validate();

export default config;
