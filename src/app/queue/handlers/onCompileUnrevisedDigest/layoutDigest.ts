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

// import { notifyBrowser } from 'app/util/notifyBrowser';

// Get all articles together into one digest e-mail

export function layoutDigest(
	website : Website,
	articles : Article[],
	template : MailTemplate,
	earliestCreated : Date,
	latestCreated : Date
) : Promise <string> {
	const html : string = template.setParams({
		// Filter all needed data
		articles: articles.map((article : Article) => ({
			title: article.title,
			url: article.url.toString(),
			byline: formatAuthors(article.authors),
			version: article.version,
		})),
		// Localization
		text: {
			itsaDigest: __('mail.digest.head'),
			articleVersion: __('mail.digest.article-version'),
			// Date range
			dateRange: __('mail.digest.date-range', {
				values: {
					earliestCreated: formatDate(earliestCreated, website.locale),
					latestCreated: formatDate(latestCreated, website.locale),
				},
			}),
		},
	})
	.render();

	// notifyBrowser(html);  // -- this is only for convenient local testing
	return Promise.resolve(html);
}

const formatAuthors = (authors : User[]) => authors.map(author => (
	`<a href="mailto:${author.email}">${author.name}</a>`
)).join(', ');

const formatDate = (d : Date, locale : string) => d.toLocaleString(locale);
