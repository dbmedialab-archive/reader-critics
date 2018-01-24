import * as app from 'app/util/applib';

import {
	DoneCallback,
	Job,
} from 'kue';

import { PollUpdateData } from 'app/services/article/ArticleService';

const log = app.createLog();

export function onPollArticleUpdate(job : Job, done : DoneCallback) : void {
	const { ID, url, version } : PollUpdateData = job.data;

	log('poll ID %s at %s', ID, url);
	setTimeout(() => {
		done();
	}, 3000);  // Consume from the queue and leave
}
