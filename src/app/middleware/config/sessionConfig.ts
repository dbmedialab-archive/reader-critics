import * as session from 'express-session';
import * as redis from 'redis';
import * as connectRedis from 'connect-redis';
import config from 'app/config';

const client = redis.createClient();
const redisStore = connectRedis(session);
const {host, port, ttl} = config.get('redis');

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
