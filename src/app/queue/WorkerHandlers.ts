import { Job } from 'kue';  // tslint:disable-line

import { onCheckAwaitFeedback } from './handlers/onCheckAwaitFeedback';
import { onNewFeedback } from './handlers/onNewFeedback';

export const jobWorkerHandlers = Object.freeze({
	onCheckAwaitFeedback,
	onNewFeedback,
});

export const webWorkerHandlers = Object.freeze({
});
