import * as Redis from 'ioredis';

import config from 'app/config';

export const dbMessageQueue = 'message-queue';
export const dbSessionCache = 'session-cache';

export default function(which : string) : Redis.Redis {
	if (![dbMessageQueue, dbSessionCache].includes(which)) {
		throw new Error(`Unknown Redis database "${which}"`);
	}

	return new Redis(config.get(`db.redis.url.${which}`));
}
