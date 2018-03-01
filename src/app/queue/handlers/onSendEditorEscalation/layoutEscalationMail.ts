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

import Article from 'base/Article';
import Feedback from 'base/Feedback';
import MailTemplate from 'app/template/MailTemplate';

import { translate as __ } from 'app/services/localization';
import { formatFeedbacks } from 'app/mail/layout/FeedbackFormat';

export function layoutEscalationMail(
	article : Article,
	feedbacks : Feedback[],
	template : MailTemplate
) : Promise <string>
{
	const { locale } = article.website;

	const html : string = template.setParams({
		editorEscalation: __('mail.fb-notify.editor-escalation', {
			locale,
			values: {
				count: feedbacks.length,
			},
		}),
		ccEditor: __('mail.fb-notify.cc-editor', locale),

		articleTitle: article.title,
		debugInfo: debugInfo(article, feedbacks),
		feedbacks: formatFeedbacks(article, feedbacks, locale),
	})
	.render();

	// notifyBrowser(html);  // -- this is only for convenient local testing

	return Promise.resolve(html);
}

function debugInfo(article : Article, feedbacks : Feedback[]) : string {
	const what = feedbacks.map((feedback : Feedback, index : number) => (
		`feedback #${index} ID = ${feedback.ID}`
	)).concat([
		`article ID = ${article.ID}`,
		`article URL = ${article.url}`,
		`article version = ${article.version}`,
	]);

	return what.join('<br/>');
}
