import * as kue from 'kue';

import { createRedisConnection } from 'app/db';

import MessageType from './MessageType';

import * as app from 'app/util/applib';

const log = app.createLog('master');

let queue : kue.Queue;

export function initMessageQueue() : Promise <void> {
	log('initMessageQueue');
	queue = kue.createQueue({
		redis: {
			createClientFactory: () => createRedisConnection(),
		},
	});

	queue.process(MessageType.NewFeedback, (job : kue.Job, done) => {
		log('New feedback in queue!', job.data)
		done();
	});

	return Promise.resolve();
}

export function sendMessage(type : MessageType, payload : any, options? : any) : Promise <void> {
	log('sending message');
	queue.create(type, payload).priority('normal').attempts(5).save();

	return Promise.resolve();
}
