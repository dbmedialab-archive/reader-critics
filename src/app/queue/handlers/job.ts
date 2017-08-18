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
	feedbackService,
	websiteService,
} from 'app/services';

import Feedback from 'base/Feedback';
import SendGridMailer from 'app/mail/sendgrid/SendGridMailer';

import * as app from 'app/util/applib';

const log = app.createLog('api');

export function onNewFeedback(job : Job, done : DoneCallback) {
	log('New feedback event received', job.data);

	if (!job.data.ID) {
		return Promise.reject(new Error('No feedback "ID" prop in job data'));
	}

	feedbackService.getByID(job.data.ID, true)
	.then((feedback : Feedback) => {
		if (feedback === null) {
			log(`Could not find feedback ID ${job.data.ID}, giving up`);
			return;
		}

		log('complete feedback object:');
		log(feedback);

		SendGridMailer(JSON.stringify(feedback, null, 2));
	})
	.then(() => done());
}
