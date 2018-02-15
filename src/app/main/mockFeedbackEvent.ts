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

// THIS FILE IS FOR TESTING PURPOSES ONLY
// As the "mock" in the name implies, we're not doing anything "serious" here.

import Article from 'base/Article';
import Feedback from 'base/Feedback';

import {
	articleService,
	feedbackService,
} from 'app/services';

import {
	sendMessage,
	MessageType,
} from 'app/queue';

import * as app from 'app/util/applib';

const log = app.createLog();

export function mockFeedbackEvent() : Promise <any> {
	// Get an article from the test crowd
	return articleService.get('http://www.mopo.no/2', '201707251349')
	// Get first feedback for this article => test contents
	.then((article : Article) => (
		article === null
			? Promise.reject('Test article not found')
			: feedbackService.getByArticle(article, 0, 1, {
				'date.created': 1,
			})
	))
	// Check result and get feedback from array
	.then((results : Feedback[]) => {
		if (results.length !== 1) {
			return Promise.reject('Test feedback not found');
		}
		return Promise.resolve(results[0]);
	})
	// Send fake event to job processor
	.then((feedback : Feedback) => {
		log('Sending queue message');
		return sendMessage(MessageType.NewFeedback, feedback);
	});
}
