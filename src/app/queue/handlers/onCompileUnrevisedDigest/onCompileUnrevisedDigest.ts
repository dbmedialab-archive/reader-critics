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

import * as app from 'app/util/applib';
import * as moment from 'moment';

import MailTemplate from 'app/template/MailTemplate';
import SendGridMailer from 'app/mail/sendgrid/SendGridMailer';

import {
	DoneCallback,
	Job,
} from 'kue';

import { Article } from 'base/Article';
import { Website } from 'base/Website';
import { EmptyError } from 'app/util/errors';
import { translate as __ } from 'app/services/localization';

import {
	articleService,
	feedbackService,
	templateService,
	websiteService,
} from 'app/services';

import {
	getRecipientList,
	MailRecipientList,
} from 'app/mail/MailRecipients';

import { layoutDigest } from './layoutDigest';

const log = app.createLog();
const dateRegex = /:00\.000Z$/;

// Main handler method, execute the job function and handle the 'kue' job

export function onCompileUnrevisedDigest(job : Job, done : DoneCallback) : void {
	process().then(() => {
		done();
		return null;
	})
	.catch(error => {
		app.yell(error);
		return done(error);
	});
}

// Job function: query all websites that should get a digest now and then
// query their relevant articles.

function process() {
	const { latestCreated, earliestCreated } = getDates();

	// We're reusing the article query date to get the websites which are up for the digest
	return websiteService.getToRunUnrevisedDigest(latestCreated)
	.then((websites) => {
		return Promise.map(websites, ((website : Website) => {
			log(
				'Checking articles from %s between %s and %s',
				website.name,
				earliestCreated.toISOString().replace(dateRegex, 'Z'),
				latestCreated.toISOString().replace(dateRegex, 'Z')
			);

			// Load mail template and query unrevised articles for this website
			return Promise.all([
				articleService.getUnrevised(website, latestCreated, earliestCreated),
				templateService.getUnrevisedDigestMailTemplate(website),
			])

			// Layout the digest e-mail, if any articles are found
			.spread((articles : Article[], template : MailTemplate) => {
				if (articles.length === 0) {
					// Flow control through exception handling is a Bad Thing™ normally.
					// Since promises don't really leave the programmer a choice to
					// "bail fast" (not to be confused with "fail fast") in a non-error
					// condition (like here, there's just no data, which is fine)
					// I'm using this way of getting of of this loop iteration.
					// The apt reader is kindly asked to think of a better way than this,
					// instead of adopting the pattern :-)
					throw new EmptyError(null);
				}

				return Promise.map(articles, (article : Article) => (
					feedbackService.getByArticle(article)
					.then((feedbacks) => {
						console.log(app.inspect(feedbacks));
						article.feedbacks = feedbacks;
						return article;
					})
				))

				.then((articlesWithFeedbacks) => [
					articlesWithFeedbacks,
					template,
				]);
			})

			.spread((articles : Article[], template : MailTemplate) => {
				log('Found %d articles on %s to include in the digest', articles.length, website.name);
				return layoutDigest(website, articles, template, earliestCreated, latestCreated);
			})

			// Send the digest e-mail
			.then((mailContent : string|null) => {
				if (mailContent === null) {
					return;  // The previous step didn't dig up anything, so do nothing here as well
				}

				return Promise.all([
					getRecipientList(website, MailRecipientList.Editors),
					getMailSubject(website, latestCreated),
				])
				.spread((recipients : Array <string>, subject : string) => {
					const rcpt = [
						// 'philipp@sol.no',
						// 'christoph.schmitz@dagbladet.no',
					];
					// log (rcpt);
					// return SendGridMailer(rcpt, subject, mailContent);
				});
			})

			// Catch errors from this loop iteration, don't let them bubble up
			// and disturb the processing of the other website items
			.catch(error => {
				if (error instanceof EmptyError) {  // That one is on purpose, really
					log('No relevant articles found for %s', website.name);
				}
				else {
					app.yell(error);
				}
			})

			// Update the "last digest"-timestamp in the website object
			.finally(() => {
				// websiteService.setUnrevisedDigestLastRun(website);
			});
		})); // Promise.map(websites)
	});
}

// Query dates

function getDates() {
	// const now = moment().second(0).millisecond(0);
	const now = moment('2018-02-28 08:00:00+01');

	const latestCreated = moment(now).add(moment.duration({ minutes: 1 })).toDate();
	const earliestCreated = moment(now).subtract(moment.duration({ hours: 24 })).toDate();

	return {
		latestCreated,
		earliestCreated,
	};
}

// E-mail subject

function getMailSubject(website : Website, latestCreated : Date) : Promise <string> {
	return Promise.resolve(__('mail.digest.subject', {
		locale: website.locale,
		values: {
			today: latestCreated.toLocaleDateString(website.locale),
		},
	}));
}
