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

import * as moment from 'moment';
import * as app from 'app/util/applib';

import {
	DoneCallback,
	Job,
} from 'kue';

import {
	sendMessage,
	MessageType,
} from 'app/queue';

import {
	feedbackService,
} from 'app/services';

import Feedback from 'base/Feedback';
import FeedbackStatus from 'base/FeedbackStatus';

const log = app.createLog();

// Number of minutes to wait for feedbacks in AwaitEnduserData status before
// their notification mail gets triggered
const awaitTimeoutMinutes : number = 15;

export function onCheckAwaitFeedback(job : Job, done : DoneCallback) : void {
	let totalCount : number;

	feedbackService.count()
	.then((count : number) => {
		totalCount = count;
		return getFeedbacks(totalCount);
	})
	.then((feedbacks : Feedback[]) => {
		log('%d total feedbacks, %d to trigger for notification', totalCount, feedbacks.length);
		return sendMessages(feedbacks);
	})
	// Don't forget to clean up the kue job!
	.then(() => {
		done();
		return null;  // Silences the "Promise handler not returned" warnings
	})
	.catch(error => {
		app.yell(error);
		return done(error);
	});
}

function getFeedbacks(totalCount : number) {
	return feedbackService.getByStatus(
		FeedbackStatus.AwaitEnduserData,
		{
			'status.changeDate': {
				'$lte': moment()
					.subtract(awaitTimeoutMinutes, 'minutes')
					.second(0)
					.millisecond(0)
					.toISOString(),
			},
		},
		0,  // query "skip" value
		totalCount  // override default limit with total count of feedback objects
	);
}

function sendMessages(feedbacks : Feedback[]) {
	return Promise.map(feedbacks, (item : Feedback) => {
		log('Trigger notification for feedback ID ', item.ID);
		return sendMessage(MessageType.NewFeedback, {
			feedbackID: item.ID,
		});
	});
}
