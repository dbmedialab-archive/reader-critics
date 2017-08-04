import {
	DoneCallback,
	Job,
} from 'kue';

import * as app from 'app/util/applib';

const log = app.createLog('api');

export function onNewFeedback(job : Job, done : DoneCallback) {
	log('New feedback in queue!', job.data);
	done();
}
