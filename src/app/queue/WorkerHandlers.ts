import { Job } from 'kue';

import {
	onCheckAwaitFeedback,
	onCheckEscalationToEditor,
	onNewFeedback,
} from './handlers';

export const jobWorkerHandlers = Object.freeze({
	onCheckAwaitFeedback,
	onCheckEscalationToEditor,
	onNewFeedback,
});

export const webWorkerHandlers = Object.freeze({
});
