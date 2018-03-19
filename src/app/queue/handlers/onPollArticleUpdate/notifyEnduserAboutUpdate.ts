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

import { isEmpty } from 'lodash';
import { EmptyError } from 'app/util/errors';
import { translate as __ } from 'app/services/localization';

import MailTemplate from 'app/template/MailTemplate';
import SendGridMailer from 'app/mail/sendgrid/SendGridMailer';

import {
	Article,
	Feedback,
	Website,
} from 'base';

import {
	feedbackService,
	templateService,
} from 'app/services';

const log = app.createLog();

export function notifyEnduserAboutUpdate(
	website : Website,
	oldRevision : Article,
	newRevision : Article
) : PromiseLike <void>
{
	let totalCount = 0;

	return feedbackService.getByArticle(oldRevision, 0, 0)
	// Filter all that have enduser data, specifically an e-mail address
	.then((feedbacks : Feedback[]) => {
		totalCount = feedbacks.length;
		return feedbacks.filter((thisFeedback) => !isEmpty(thisFeedback.enduser.email));
	})

	// Check for available enduser data, also log some numbers
	.then((feedbacksWithUserData : Feedback[]) => {
		log(
			'Article has %d total feedbacks of which %d have enduser data with an e-mail address',
			totalCount, feedbacksWithUserData.length
		);

		if (feedbacksWithUserData.length === 0) {
			// Flow control through exception handling is a Bad Thing™ and I have
			// to state that here again, because I'm repeating that pattern!
			throw new EmptyError(null);
		}

		// Extract user e-mail addresses
		return Promise.all([
			feedbacksWithUserData.map((feedback : Feedback) => feedback.enduser.email),
			layoutNotification(website, newRevision),
			getMailSubject(website, newRevision),
		]);
	})

	// Put everything together und shoot the mail
	.spread((recipients : string[], html : string, subject : string) => (
		SendGridMailer(recipients, subject, html)
	));
}

// E-mail layout

function layoutNotification(
	website : Website,
	newRevision : Article
) : PromiseLike <string>
{
	const { locale } = website;

	return templateService.getEnduserUpdatedArticleMailTemplate(website)
	.then((template : MailTemplate) => (
		template.setParams({
			article: {
				title: newRevision.title,
				url: newRevision.url.toString(),
			},
			text: {
				hello: __('mail.hello', locale),
				updated: __('mail.eu-notify.has-been-updated', locale),
				system: __('mail.eu-notify.system-can-not-know', {
					locale,
					values: {
						datetime: newRevision.date.created.toLocaleString(locale),
					},
				}),
				mfg: __('mail.regards', locale),
			},
		}).render()
	));
}

// E-mail subject

function getMailSubject(website : Website, newRevision : Article) : PromiseLike <string> {
	return Promise.resolve(__('mail.eu-notify.subject', {
		locale: website.locale,
		values: {
			title: newRevision.title,
		},
	}));
}
