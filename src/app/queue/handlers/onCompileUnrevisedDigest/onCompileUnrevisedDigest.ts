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
import { translate as __ } from 'app/services/localization';

import {
	articleService,
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
		websites.forEach(website => {
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

			// Layout the digest e-mail
			.spread((articles : Article[], template : MailTemplate) => (
				(articles.length > 0)
					? layoutDigest(website, articles, template, earliestCreated, latestCreated)
					: null
			))

			// Send the digest e-mail
			.then((mailContent : string|null) => {
				if (mailContent === null) {
					return;
				}

				return Promise.all([
					getRecipientList(website, MailRecipientList.Editors),
					getMailSubject(website, latestCreated),
				])
				.spread((recipients : Array <string>, subject : string) => {
					return SendGridMailer(recipients, subject, mailContent);
				});
			})
			// Update the "last digest"-timestamp in the website object
			.finally(() => {
	//			websiteService.setUnrevisedDigestLastRun(website);
			});
		}); // websites.forEach
	});
}

// Query dates

function getDates() {
	const latestCreated = moment().second(0).millisecond(0)
		.toDate();
	const earliestCreated = moment(latestCreated)
		.subtract(moment.duration({ hours: 24 }))
		.toDate();

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
