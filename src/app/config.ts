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

// tslint:disable:max-line-length max-file-line-count

import * as cluster from 'cluster';
import * as fs from 'fs';
import * as path from 'path';
import * as convict from 'convict';

import printEnvironment from 'print-env';

import {
	dbMessageQueue,
	dbSessionCache,
} from 'app/db/createRedisConnection';

import { rootPath } from 'app/util/applib';

import * as app from 'app/util/applib';

const log = app.createLog('config');
const isDumpEnabled = cluster.isMaster && app.isDevelop;

const isHexSecret = (val : any) => /^[a-fA-F0-9]{64}$/.test(val);

if (isDumpEnabled) {
	printEnvironment(log);
}

convict.addFormats({
	'hex-secret': {
		validate: (value) => {
			if (!isHexSecret(value)) {
				throw new Error('Must be a 64 character hex key');
			}
		},
	},
	'string-or-empty': {
		validate: (value) => {
			if (!(
				((typeof value === 'string'))
				|| value === null
				|| value === undefined
			)) {
				throw new Error('Must be a string value or empty (null/undefined)');
			}
		},
		coerce: (value) => ((typeof value === 'string') && value.length > 0)
			? value
			: undefined,
	},
});

const config = convict({
	analytics: {
		google: {
			trackingID: {
				default: undefined,
				format: 'string-or-empty',
				doc: 'Set this to your GA tracking ID to activate it in all page templates',
				env: 'ANALYTICS_GOOGLE_TRACKING_ID',
			},
		},
	},
	auth: {
		bcrypt: {
			rounds: {
				doc: 'Number of salt rounds when hashing passwords with BCrypt',
				// BCrypt documentation recommends chosing the number of salt rounds so
				// that the salting process takes about one second on the target machine.
				// The default of 14 rounds takes ~900ms on a Skylake E5v3 Xeon (tested)
				default: 14,
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
	db: {
		mongo: {
			url: {
				doc: 'MongoDB connection URL for the main backend database',
				format: String,
				default: 'mongodb://localhost:27017/readercritics',
				env: 'MONGODB_URL',
			},
			reconnectionLimit: {
				default: 5,
				format: Number,
				doc: 'Amount of tries for reconnect to mongoDB if it is down on startup',
				env: 'MONGODB_RECONNECTION_LIMIT',
			},
		},
		redis: {
			url: {
				// See app/db/createRedisConnection for details about the constants
				[dbMessageQueue]: {
					doc: 'Redis URL for the database that holds the message queue',
					format: String,
					default: null,
					env: 'REDIS_URL_MESSAGE_QUEUE',
				},
				[dbSessionCache]: {
					doc: 'Redis URL for the database that holds the session cache',
					format: String,
					default: null,
					env: 'REDIS_URL_SESSION_CACHE',
				},
			},
		},
	},
	http: {
		port: {
			doc: 'Network port where the HTTP server is going to listen',
			format: 'port',
			default: 4000,
			env: 'HTTP_PORT',
		},
	},
	localization: {
		systemLocale: {
			doc: 'Default system locale that will be used when websites do not override',
			format: String,
			default: 'en',
			env: 'I18N_SYS_LOCALE',
		},
	},
	mail: {
		sender: {
			domain: {
				default: 'readercritics.com',
				format: String,
				env: 'MAIL_SENDER_DOMAIN',
			},
		},
		sendgrid: {
			api_key: {
				default: undefined,
				format: 'string-or-empty',
				doc: 'API key for SendGrid mail service, used if no other service is configured',
				env: 'SENDGRID_API_KEY',
			},
		},
		bccRecipient: {
			default: undefined,
			format: 'string-or-empty',
			doc: 'Set this to a valid e-mail address to BCC all outgoing mail to it.',
			env: 'MAIL_BCC_RECIPIENT',
		},
		testOverride: {
			default: undefined,
			format: 'string-or-empty',
			doc: 'Set this to a valid e-mail address to direct ALL outgoing mail to it. Automatically disabled in production mode.',
			env: 'MAIL_TEST_OVERRIDE',
		},
	},
	recaptcha: {
		key: {
			secret: {
				default: undefined,
				doc: 'Secret Google Recaptcha key',
				format: 'string-or-empty',
				env: 'RECAPTCHA_SECRET_KEY',
			},
			public: {
				default: undefined,
				doc: 'Public Google Recaptcha key',
				format: 'string-or-empty',
				env: 'RECAPTCHA_PUBLIC_KEY',
			},
		},
	},
	slack: {
		channel: {
			default: undefined,
			format: 'string-or-empty',
			doc: 'Channel name for the Slack integration to use for notifications. Overrides the Webhook configuration on the receiver.',
			env: 'SLACK_CHANNEL',
		},
		botname: {
			default: 'Reader Critics',
			format: 'string-or-empty',
			doc: 'Bot name for the Slack integration.',
			env: 'SLACK_BOTNAME',
		},
		webhook: {
			default: undefined,
			format: 'string-or-empty',
			doc: 'If set to a Slack webhook URL, warnings and errors will be posted to this integration',
			env: 'SLACK_WEBHOOK',
		},
	},
});

{
	const configFile = path.join(rootPath, 'config.json5');

	if (fs.existsSync(configFile)) {
		try {
			config.loadFile(configFile);
		}
		catch (error) {
			log('Error while trying to load %s', configFile);
			log(error);
		}
	}
}

try {
	config.validate();

	if (config.get('auth.jwt.secret') === config.get('auth.session.secret')) {
		throw new Error('JWT and session secret are identical');
	}

	if (isDumpEnabled) {
		log(app.inspect(config.getProperties()));
	}
}
catch (error) {
	log('Configuration error:', error.message);
	process.exit(128);
}

export default config;
