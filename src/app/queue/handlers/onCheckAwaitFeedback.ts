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

import * as app from 'app/util/applib';

const log = app.createLog();

export function onCheckAwaitFeedback(job : Job, done : DoneCallback) : void {
	feedbackService.getByStatus(FeedbackStatus.AwaitEnduserData)
	.then((feedbacks : Feedback[]) => {
		log('%d feedbacks to trigger for notification', feedbacks.length);

		return Promise.map(feedbacks, (item : Feedback) => {
			return sendMessage(MessageType.NewFeedback, {
				feedbackID: item.ID,
			});
		});
	})
	// Don't forget to clean up the kue job!
	.then(() => done());
}
