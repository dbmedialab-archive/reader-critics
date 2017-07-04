import * as session from 'express-session';
import * as redis from 'redis';
import * as connectRedis from 'connect-redis';
import config from 'app/config';

const client = redis.createClient();
const redisStore = connectRedis(session);
const {host, port, ttl} = config.get('redis');

export const sessionConf = {
	store: new redisStore({
		host: host,
		port: port,
		client,
		ttl: ttl,
	}),
	secret: 'reader-critic-session-secret',		// TODO replace with needed
	resave: false,
	saveUninitialized: false,
	cookie: {
		path: '/admin',
		secure: false,
		maxAge: (60 * 60 * 1000),
	},
};
