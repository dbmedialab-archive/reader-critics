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

import MailTemplate from 'app/template/MailTemplate';

import { Article } from 'base/Article';
import { User } from 'base/User';
import { Website } from 'base/Website';
import { translate as __ } from 'app/services/localization';

import { notifyBrowser } from 'app/util/notifyBrowser';

// Get all articles together into one digest e-mail

export function layoutDigest(
	website : Website,
	articles : Article[],
	template : MailTemplate,
	earliestCreated : Date,
	latestCreated : Date
) : Promise <string> {
	const { locale } = website;
	const html : string = template.setParams({
		// Filter all needed data
		articles: articles.map((article : Article) => ({
			title: article.title,
			url: article.url.toString(),
			byline: formatAuthors(article),
			feedbackCount: formatFeedbacks(article, locale),
		})),
		// Localization
		text: {
			itsaDigest: __('mail.digest.head', locale),
			author: __('mail.digest.author'),
			// Date range
			dateRange: __('mail.digest.date-range', {
				locale,
				values: {
					earliestCreated: `<b>${formatDate(earliestCreated, locale)}</b>`,
					latestCreated: `<b>${formatDate(latestCreated, locale)}</b>`,
				},
			}),
		},
	})
	.render();

	notifyBrowser(html);  // -- this is only for convenient local testing
	return Promise.resolve(html);
}

const formatAuthors = (article : Article) => article.authors.map(author => (
	`<a href="mailto:${author.email}">${author.name}</a>`
)).join(', ');

const formatFeedbacks = (article : Article, locale : string) => (
	__('mail.digest.feedback-count', {
		locale,
		values: {
			count: article.feedbacks.length,
		},
	})
);

const formatDate = (d : Date, locale : string) => d.toLocaleString(locale);
