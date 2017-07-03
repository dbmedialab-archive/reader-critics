import * as session from 'express-session';
import * as redis from 'redis';
import * as connectRedis from 'connect-redis';

const client = redis.createClient();
const redisStore = connectRedis(session);

export const sessionConf = {
	store: new redisStore({
		host: 'localhost',
		port: 6379,
		client,
		ttl: 260,
	}),
	secret: 'reader-critic-session-secret',
	resave: false,
	saveUninitialized: false,
	cookie: {
		path: '/admin',
		secure: false,
		maxAge: (60 * 60 * 1000),
	},
};
