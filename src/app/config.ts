import * as convict from 'convict';
import * as crypto from 'crypto';
import User from './models/User';

const cryptoBytes = crypto.randomBytes(32);
const secret = cryptoBytes.toString('hex');

const config = convict({
	http: {
		port: {
			doc: 'Network port where the HTTP server is going to listen',
			format: 'port',
			default: 4000,
			env: 'HTTP_PORT',
		},
	},
	parser: {
		doc: 'Fallback setting for the article parser',
		fallback: 'html',
		env: 'PARSER',
	},
	jwt: {
		jwtSecret: 'secret',		// TODO something with multi-threading for secret with crypto
		jwtDuration: '2 hours',
		env: 'JWT',
	},
	// TODO remove it on DB added
	users: [
		new User({name: 'admin', login: 'admin', password: 'test'}),
	],
});

config.validate();

export default config;
