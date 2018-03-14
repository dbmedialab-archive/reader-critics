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

import { assert } from 'chai';
import { feedbackService } from 'app/services';
import { Feedback } from 'base/Feedback';
import { FeedbackStatus } from 'base/FeedbackStatus';
import { assertFeedbackObject } from './assertFeedbackObject';

// feedbackService.updateStatus()

export const testUpdateStatus = () => it('updateStatus()', () => {
	let thatFeedback;

	return feedbackService.getRange(0, 1)
	.then((feedbacks : Feedback[]) => {
		assert.lengthOf(feedbacks, 1);
		thatFeedback = feedbacks[0];
		assertFeedbackObject(thatFeedback);
	})
	.then(() => (
		feedbackService.updateStatus(thatFeedback, FeedbackStatus.FeedbackSent)
	))
	.then(() => (
		feedbackService.getByID(thatFeedback.ID)
	))
	.then((updatedFeedback) => {
		assertFeedbackObject(updatedFeedback);
		assert.strictEqual(
			updatedFeedback.status.status,
			FeedbackStatus.FeedbackSent.toString()
		);
	});
});

// feedbackService.getByStatus()

export const testGetByStatus = () => it('getByStatus()', () => {
	return Promise.all([
		feedbackService.getByStatus(FeedbackStatus.AwaitEnduserData),
		feedbackService.getByStatus(FeedbackStatus.FeedbackSent),
	])
	.spread((resultAwait : Feedback[], resultSent : Feedback[]) => {
		const numAwait = 7;
		assert.lengthOf(
			resultAwait, numAwait,
			`Expected ${numAwait} feedbacks in status "AwaitEnduserData"`
		);

		resultAwait.forEach((feedback, index) => {
			assertFeedbackObject(feedback);
		});

		const numSent = 1;
		assert.lengthOf(
			resultSent, numSent,
			`Expected ${numSent} feedbacks in status "FeedbackSent"`
		);

		resultSent.forEach((feedback, index) => {
			assertFeedbackObject(feedback);
		});
	});
});
