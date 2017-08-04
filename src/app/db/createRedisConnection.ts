import * as Redis from 'ioredis';

import config from 'app/config';

export default function() : Redis.Redis {
	return new Redis(config.get('db.redis.url'));
}
