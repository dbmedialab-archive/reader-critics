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
import FeedbackStatus from 'base/FeedbackStatus';
import MailTemplate from 'app/template/MailTemplate';
import Website from 'base/Website';

import {
	feedbackService,
	templateService,
	websiteService,
} from 'app/services';

import {
	sendMessage,
	MessageType,
} from 'app/queue';

import { getFeedbackRecipients } from 'app/mail/MailRecipients';

import layoutNotifyMail from './layoutNotifyMail';
import SendGridMailer from 'app/mail/sendgrid/SendGridMailer';

import * as app from 'app/util/applib';

const log = app.createLog();

export function onNewFeedback(job : Job, done : DoneCallback) : void {
	const { feedbackID } = job.data;

	if (feedbackID === undefined) {
		log('Feedback "ID" not found in job data');
		return done();
	}

	log(`Received new feedback event for ID ${feedbackID}`);

	process(feedbackID).then(() => {
		done();
		return null;  // Silences the "Promise handler not returned" warnings
	})
	.catch(error => {
		app.yell(error);
		done(error);
		return null;
	});
}

function process(feedbackID : string) {
	let feedback : Feedback;
	let template : MailTemplate;
	let website : Website;

	// First, get the feedback object
	return feedbackService.getByID(feedbackID)
	// Now that we have the article inside the feedback object, we can
	// ask for the "Website" that all this belongs to:
	.then((f : Feedback) => {
		feedback = f;  // But first, store these objects for later

		const websiteID : any = feedback.article.website;
		return websiteService.getByID(websiteID as string);
	})
	.then((w : Website) => {
		website = w;

		return templateService.getFeedbackMailTemplate(website);
	})
	// Now we have all the necessary objects, let's go ahead and make an e-mail
	// out of them
	.then((t: MailTemplate) => {
		template = t;

		// Again in parallel: layout the e-mail content and create a list of
		// recipients mail addresses that will receive this. Currently, the
		// function that creates the recipient list is not asynchronous but it
		// returns a Promise anyway. If no recipients can be found, it uses a
		// reject for flow control.
		return Promise.all([
			layoutNotifyMail(feedback, template),
			getFeedbackRecipients(website, feedback.article),
			getMailSubject(feedback),
		]);
	})
	.spread((htmlMailContent : string, recipients : Array <string>, subject : string) => {
		return SendGridMailer(recipients, `Leserkritikk - ${subject}`, htmlMailContent);
	})
	.then(() => feedbackService.updateStatus(feedback, FeedbackStatus.FeedbackSent))
	.then(() => sendMessage(MessageType.CheckEscalationToEditor, {
		articleID: feedback.article.ID,
	}));
}

function getMailSubject(feedback : Feedback) : Promise <string> {
	return Promise.resolve(feedback.article.title);
}
