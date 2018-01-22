import * as app from 'app/util/applib';

import {
	DoneCallback,
	Job,
} from 'kue';

const log = app.createLog();

export function onPollArticleUpdate(job : Job, done : DoneCallback) : void {
	const { articleID } = job.data;

	log('poll this one:', articleID);
	setTimeout(() => {
		done();
	}, 3000);  // Consume from the queue and leave
}
