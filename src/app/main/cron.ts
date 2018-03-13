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

import { CronJob } from 'cron';
import { wrapCronFn } from './vote';

import {
	maintenance,
	sendMessage,
	MessageType,
} from 'app/queue';

import * as app from 'app/util/applib';

const log = app.createLog('cron');

const activeJobs : Array <CronJob> = [];

export function initCron() : Promise <void> {
	log('Initialising ...');

	jobCheckAwaitFeedback();
	jobCollectArticlesForPolling();
	jobCompileUnrevisedDigest();
	jobMessageQueueMaintenance();

	return Promise.resolve();
}

function jobCheckAwaitFeedback() {
	activeJobs.push(new CronJob({
		cronTime: '0 * * * * *',  // Every minute
		onTick: () => wrapCronFn(() => {
			sendMessage(MessageType.CheckAwaitFeedback);
		}),
		start: true,
	}));
}

function jobCollectArticlesForPolling() {
	activeJobs.push(new CronJob({
		cronTime: '0 30 * * * *',  // Every hour at xx:30
		onTick: () => wrapCronFn(() => {
			sendMessage(MessageType.CollectArticlesForPolling);
		}),
		start: true,
	}));

	setTimeout(() => {
		sendMessage(MessageType.CollectArticlesForPolling);
	}, 2500);
}

function jobCompileUnrevisedDigest() {
	activeJobs.push(new CronJob({
		cronTime: '0 1 * * * *',
		onTick: () => sendMessage(MessageType.CompileUnrevisedDigest),
		start: true,
	}));
}

function jobMessageQueueMaintenance() {
	activeJobs.push(new CronJob({
		cronTime: '0 */10 * * * *',  // Every 10 minutes
		onTick: () => wrapCronFn(() => {
			maintenance();
		}),
		start: true,
	}));
}
