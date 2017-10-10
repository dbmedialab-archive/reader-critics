import { Job } from 'kue';

import Article from 'base/Article';
import Feedback from 'base/Feedback';

import {
	articleService,
	feedbackService,
} from 'app/services';

import onNewFeedback from 'app/queue/handlers/onNewFeedback';

import * as app from 'app/util/applib';

const log = app.createLog();

export function mockFeedbackEvent() : Promise <any> {
	log('### MOCK new feedback event #######################################################');

	// Get an article from the test crowd
	return articleService.get('http://www.mopo.no/2', '201707251349')
	// Get first feedback for this article => test contents
	.then((article : Article) => {
		if (article === null) {
			return Promise.reject('Test article not found');
		}
		return feedbackService.getByArticle(article, 0, 1, {
			'date.created': 1,
		});
	})
	// Check result and get feedback from array
	.then((results : Feedback[]) => {
		if (results.length !== 1) {
			return Promise.reject('Test feedback not found');
		}
		return Promise.resolve(results[0]);
	})
	// Send fake event to job processor
	.then((feedback : Feedback) => onNewFeedback(<Job> {
		data: feedback,
	}, () => {
		log('done() callback');
		log('### MOCK feedback event finished ##################################################');
	}));
}
