import { createRedisConnection } from 'app/db';
import { dbMessageQueue } from 'app/db/createRedisConnection';

import * as IORedis from 'ioredis';
import * as app from 'app/util/applib';

const log = app.createLog('vote');

const lockKey = 'vote-lock:masterID';

// These time constants are in seconds
const startupVariance = 2;  // Variance is applied as a random time span
const rewriteVariance = 1;
const lockTimeToLive = 5;  // Time until the lock key in Redis expires

let redis : IORedis.Redis;
let isMaster : boolean = false;

export function initVote() : Promise <void> {
	const startupDelay = Math.round(Math.random() * (startupVariance * 1000));
	log('Initialising master vote (%dms)', startupDelay);
	redis = createRedisConnection(dbMessageQueue);

	setTimeout(() => {
		lockHandler();

		// The rewrite delay is shorter than the key TTL to ensure that the key
		// gets refreshed by the current master in Redis before it expires.
		const rewriteDelay = (1000 * lockTimeToLive)
			- Math.round(Math.random() * (rewriteVariance * 1000));

		log('Starting vote lock rewrite loop (%dms)', rewriteDelay);

		setInterval(() => lockHandler(), rewriteDelay);
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
			log('Acquired master');
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

/**
 * This wrapper takes a cron function to execute. The provided function will
 * only be called if the local node is the current master in the cluster, thus
 * ensuring that jobs only get triggered once in a distributed deployment.
 *
 * The wrapper retries for 2*lockTimeToLive and checks if the master flag turns
 * "true" on this node. This timeout ensures that jobs get executed (with a
 * slight delay) even if the current master has just gone away. Especially
 * helpful with jobs that f.ex. are only triggered once per day.
 *
 * If this node is the current master, the cron function will be executed
 * immediately.
 */
export function wrapCronFn(cronFn : Function) {
	const executeCronFn = () => {
		try {
			cronFn();
		}
		catch (error) {
			app.yell(error);
		}
	};

	// If this is the master node, shoot the cron function and instantly leave
	if (isMaster) {
		executeCronFn();
		return;
	}

	// If this is not master, wait for 2*lockTimeToLive if this node acquires it
	const startTime = Math.round(Date.now() / 1000);

	const intvID : NodeJS.Timer = setInterval(() => {
		const nowTime = Math.round(Date.now() / 1000);

		if (nowTime >= startTime + (lockTimeToLive * 2)) {
			clearInterval(intvID);  // Timeout, not trying anymore
		}
		else if (isMaster) {  // Retrying
			clearInterval(intvID);
			executeCronFn();
		}
	}, 1000);
}
