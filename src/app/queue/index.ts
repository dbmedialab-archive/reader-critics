//
// LESERKRITIKK v2 (aka Reader Critics)
// Copyright (C) 2017 DB Medialab/Aller Media AS, Oslo, Norway
// https://github.com/dbmedialab/reader-critics/
//
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with
// this program. If not, see <http://www.gnu.org/licenses/>.
//

import * as colors from 'ansicolors';
import * as kue from 'kue';

import { createRedisConnection } from 'app/db';
import { dbMessageQueue } from 'app/db/createRedisConnection';

import {
	onCheckAwaitFeedback,
	onCheckEscalationToEditor,
	onCollectArticlesForPolling,
	onCompileNonUpdatedDigest,
	onNewFeedback,
	onPollArticleUpdate,
	onSendEditorEscalation,
} from './handlers';

import * as app from 'app/util/applib';

// Define which job handlers are available to what worker type

const jobWorkerHandlers = Object.freeze({
	onCheckAwaitFeedback,
	onCheckEscalationToEditor,
	onCollectArticlesForPolling,
	onCompileNonUpdatedDigest,
	onNewFeedback,
	onPollArticleUpdate,
	onSendEditorEscalation,
});

// const webWorkerHandlers = Object.freeze({
// }); - still empty

// Internal resources

const log = app.createLog();

let queue : kue.Queue;

// All message types

export enum MessageType {
	CheckAwaitFeedback = 'check-await-feedback',
	CheckEscalationToEditor = 'check-escalation-to-editor',
	CollectArticlesForPolling = 'collect-articles-for-polling',
	CompileNonUpdatedDigest = 'compile-non-updated-digest',
	NewFeedback = 'new-feedback',
	PollArticleUpdate = 'poll-article-update',
	SendEditorEscalation = 'send-editor-escalation',
	SendSuggestionDigest = 'send-suggestion-digest',
}

// Queue initialization for the different worker types

export function initMasterQueue() : Promise <void> {
	log('Initialising %s worker queue', colors.brightRed('master'));

	queue = kue.createQueue({
		redis: {
			createClientFactory: () => createRedisConnection(dbMessageQueue),
		},
	});

	queue.active((error, ids : number[]) => {
		ids.forEach((jobID : number) => {
			kue.Job.get(jobID, (error2, job) => {
				log('Removing completed job', jobID);
				job.remove();
			});
		});
	});

	return Promise.resolve();
}

export function initJobWorkerQueue() : Promise <void> {
	log('Initialising %s worker queue', colors.brightYellow('job'));
	queue = kue.createQueue({
		redis: {
			createClientFactory: () => createRedisConnection(dbMessageQueue),
		},
	});

	Object.keys(MessageType).forEach((msgType : string) => {
		const handler = jobWorkerHandlers[`on${msgType}`];
		if (handler) {
			queue.process(MessageType[msgType], handler);
			log('Installed handler for "%s" messages', colors.brightGreen(msgType));
		}
		else {
			log('No handler found for "%s" messages', colors.brightRed(msgType));
		}
	});

	return Promise.resolve();
}

export function initWebWorkerQueue() : Promise <void> {
	log('Initialising %s worker queue', colors.brightGreen('web'));
	queue = kue.createQueue({
		redis: {
			createClientFactory: () => createRedisConnection(dbMessageQueue),
		},
	});

	return Promise.resolve();
}

// Push messages into the queue

export function sendMessage(type : MessageType, payload? : {}, options? : {}) : Promise <void> {
	const paypayloadload = payload === undefined ? {} : payload;
	log(type, app.inspect(paypayloadload, 1, false));

	queue.create(type, paypayloadload)
		.priority('normal')
		.attempts(1)
		.removeOnComplete(true)
		.save();

	return Promise.resolve();
}
