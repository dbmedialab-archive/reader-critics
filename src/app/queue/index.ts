import * as kue from 'kue';

import { createRedisConnection } from 'app/db';
import { dbMessageQueue } from 'app/db/createRedisConnection';

import MessageType from './MessageType';

import * as app from 'app/util/applib';

const log = app.createLog();

let queue : kue.Queue;

export function initMessageQueue(jobReceiver? : any) : Promise <void> {
	log('initMessageQueue');
	queue = kue.createQueue({
		redis: {
			createClientFactory: () => createRedisConnection(dbMessageQueue),
		},
	});

	if (jobReceiver) {
		log('Job receiver:', jobReceiver);

		Object.keys(MessageType).forEach((msgType : string) => {
			const handler = jobReceiver[`on${msgType}`];
			if (handler) {
				queue.process(MessageType[msgType], handler);
				log(`Installed handler for "${msgType}" messages`);
			}
			else {
				log(`No handler found for message type "${msgType}"`);
			}
		});
	}
	else {
		log('No job receiver');
	}

	return Promise.resolve();
}

export function sendMessage(type : MessageType, payload : any, options? : any) : Promise <void> {
	log(`sending "${type}" message`);
	queue.create(type, payload).priority('normal').attempts(5).save();

	return Promise.resolve();
}
