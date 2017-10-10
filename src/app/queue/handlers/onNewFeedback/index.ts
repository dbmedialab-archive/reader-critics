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

import Feedback from 'base/Feedback';
import MailTemplate from 'app/template/MailTemplate';
import Website from 'base/Website';

import {
	feedbackService,
	templateService,
	websiteService,
} from 'app/services';

import layoutNotifyMail from './layoutNotifyMail';
import SendGridMailer from 'app/mail/sendgrid/SendGridMailer';

import * as app from 'app/util/applib';

const log = app.createLog();

export default function(job : Job, done : DoneCallback) : Promise <void> {
	if (!job.data.ID) {
		log('Feedback "ID" not found in job data');
		return Promise.resolve();
	}

	log(`Received new feedback event for ID ${job.data.ID}`);

	let feedback : Feedback;
	let template : MailTemplate;
	let website : Website;

	return new Promise <void> ((resolve, reject) => {
		Promise.all([
			feedbackService.getByID(job.data.ID),
			templateService.getFeedbackNotifyTemplate(),
		])
		.spread((f : Feedback, t : MailTemplate) => {
			feedback = f;
			template = t;

			return websiteService.getByID(feedback.article.website);
		})
		.then((w : Website) => {
			website = w;
			log('Loaded article website:', app.inspect(website));

			return layoutNotifyMail(feedback, template);
		})

		.then((htmlMailContent : string) => {
		// 	const recipients = getRecipients
			log(htmlMailContent);
			if (false || 0) {
				return SendGridMailer('philipp@sol.no', 'Leserkritikk', htmlMailContent);
			}
		})
		.then(() => {
			done();
			resolve();
		})
		.catch(reject);
	});
}
