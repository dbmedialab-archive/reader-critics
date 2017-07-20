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

import * as app from 'app/util/applib';

const log = app.createLog('config');

const isHexSecret = (val : any) => /^[a-fA-F0-9]{64}$/.test(val);

convict.addFormat({
	name: 'hex-secret',
	validate: (value) => {
		if (!isHexSecret(value)) {
			throw new Error('Must be a 64 character hex key');
		}
	},
});

const config = convict({
	http: {
		port: {
			doc: 'Network port where the HTTP server is going to listen',
			format: 'port',
			default: 4000,
			env: 'HTTP_PORT',
		},
	},
	db: {
		mongo: {
			url: {
				doc: 'MongoDB connection URL for the main backend database',
				format: String,
				default: 'mongodb://localhost:27017/readercritics',
				env: 'MONGODB_URL',
			},
		},
		redis: {
			url: {
				doc: 'Redis URL to connect to (including auth string)',
				format: String,
				default: 'redis://localhost:6379',
				env: 'REDIS_URL',
			},
			host: 'localhost',
			port: 6379,
			ttl: 260,
		},
	},
	auth: {
		bcrypt: {
			rounds: {
				doc: 'Number of salt rounds when hashing passwords with BCrypt',
				default: 14,  // takes ~900ms on a Skylake E5v3 Xeon
				env: 'AUTH_BCRYPT_ROUNDS',
			},
		},
		jwt: {
			secret: {
				default: null,
				doc: '64 character hexadecimal random sequence for signing JSON web tokens',
				format: 'hex-secret',
				env: 'AUTH_JWT_SECRET',
			},
			session: {
				default: true,
				format: Boolean,
				env: 'AUTH_JWT_SESSION',
			},
		},
		session: {
			secret: {
				default: null,
				doc: '64 character hexadecimal random sequence for signing session tokens',
				format: 'hex-secret',
				env: 'AUTH_SESSION_SECRET',
			},
			ttl: {
				default: 30,
				doc: 'Lifetime of a session in minutes',
				format: 'nat',
				env: 'AUTH_SESSION_TTL',
			},
		},
	},
});

try {
	config.validate();

	if (config.get('auth.jwt.secret') === config.get('auth.session.secret')) {
		throw new Error('JWT and session secret are identical');
	}
}
catch (error) {
	log('Configuration error:', error.message);
	process.exit(128);
}

export default config;
