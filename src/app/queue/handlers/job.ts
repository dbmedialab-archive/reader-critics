import {
	DoneCallback,
	Job,
} from 'kue';

export function onNewFeedback(job : Job, done : DoneCallback) {
	log('New feedback in queue!', job.data);
	done();
}
