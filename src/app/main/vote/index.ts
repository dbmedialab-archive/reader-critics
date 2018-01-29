import { createRedisConnection } from 'app/db';
import { dbMessageQueue } from 'app/db/createRedisConnection';

import * as IORedis from 'ioredis';
import * as app from 'app/util/applib';

const log = app.createLog('vote');

const lockKey = 'vote-lock:masterID';

// These time constants are in seconds
const startupVariance = 2;
const rewriteVariance = 2;
const lockTimeToLive = 10;

let redis : IORedis.Redis;
let isMaster : boolean = false;

export function initVote() : Promise <void> {
	const startupDelay = Math.round(Math.random() * (startupVariance * 1000));
	log('Initialising master vote (%dms)', startupDelay);
	redis = createRedisConnection(dbMessageQueue);

	setTimeout(() => {
		lockHandler();

		const rewriteDelay = (1000 * lockTimeToLive)
			- Math.round(Math.random() * (rewriteVariance * 1000));
		log('Starting vote lock rewrite loop (%dms)', rewriteDelay);

		setInterval(() => {
			lockHandler();
		}, rewriteDelay);
	}, startupDelay);

	return Promise.resolve();
}

const getLock = () => redis.get(lockKey);

const setLock = () => redis.set(lockKey, app.nodeID, 'ex', lockTimeToLive);

function lockHandler() {
	getLock().then((value) => {
		// Application start and the lock doesn't exist yet or the old master node
		// has gone away and the lock was deleted by Redis after expiring its TTL
		if (value === null) {
			setLock();
			isMaster = true;
			log('Aquiring master');
		}
		// Lock exists and contains the ID of this node; rewrite it to extend TTL
		else if (value === app.nodeID) {
			setLock();
			isMaster = true;
		}
		// Every other case: this is not the master node
		else {
			isMaster = false;
		}
	});
}
