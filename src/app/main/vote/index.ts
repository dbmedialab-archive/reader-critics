import { createRedisConnection } from 'app/db';
import { dbMessageQueue } from 'app/db/createRedisConnection';

import * as IORedis from 'ioredis';
import * as app from 'app/util/applib';

const log = app.createLog('vote');

const lockPrefix = 'vote-lock';
const dataPrefix = 'vote-data';

// These time constants are in seconds
const startupVariance = 2;
const rewriteVariance = 2;
const lockTimeToLive = 10;

let redis : IORedis.Redis;
let master : boolean = false;

let countReElect = 0;
let countNoElect = 0;

export const isMaster = () => master;

export function initVote() : Promise <void> {
	const startupDelay = Math.round(Math.random() * (startupVariance * 1000));
	log('Initialising master vote (%dms)', startupDelay);
	redis = createRedisConnection(dbMessageQueue);

	setTimeout(() => {
		writeLock();

		const rewriteDelay = Math.round(Math.random() * (rewriteVariance * 1000))
			+ (1000 * lockTimeToLive);
		log('Starting lock rewrite loop (%dms)', rewriteDelay);

		setInterval(() => {
			writeLock();
		}, rewriteDelay);
	}, startupDelay);

	return Promise.resolve();
}

function writeLock() {
	log('Writing vote lock');
	const myKey = `${lockPrefix}:${app.nodeID}`;
	redis.set(myKey, true, 'ex', lockTimeToLive);

	redis.keys(`${lockPrefix}:*`).then(function (keys) {
		log(keys);
		// This is obvious: either this node is the only one in the eco-system
		// or it was the first one that got started. Double check for the ID though.
		if (keys.length === 1 && keys[0] === myKey) {
			log("I'm master");
			redis.set(`${dataPrefix}:masterID`, app.nodeID);
			master = true;
			countReElect = 0;
			countNoElect = 0;
		}
		// Now it gets more complicated; more nodes in the lock list?
		// - check if my own ID matches the master ID, then I'm still master
		// - check if the master ID is included in the lock list at all; if it is
		//   not, this means the current master failed to rewrite its lock and is
		//   probably dead.
		else if (keys.length > 1 && keys.includes(myKey)) {
			redis.get(`${dataPrefix}:masterID`).then((value) => {
				if (value === app.nodeID) {
					countReElect ++;
					countNoElect = 0;
					log("I'm still master (%d)", countReElect);
					master = true;
				}
				else {
					countReElect = 0;
					countNoElect ++;
					redis.del(myKey);
					log('Not master (%d)', countNoElect);
					master = false;
				}
			});
		}
		else {
			log("I'm totally not master");
			countReElect = 0;
			countNoElect = 0;
			master = false;
		}
		/* else {
			redis.get(`${dataPrefix}:masterID`).then((value) => {
				log('Current master is', value);
			});
			log("I'm not master");
			master = false;
		} */
	});
}
