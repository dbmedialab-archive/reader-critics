import { Job } from 'kue';  // tslint:disable-line

import onNewFeedback from './handlers/onNewFeedback';

export const jobWorkerHandlers = Object.freeze({
	onNewFeedback,
});

export const webWorkerHandlers = Object.freeze({
});
