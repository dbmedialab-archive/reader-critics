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

import { articleService }  from 'app/services';
import { translate as __ } from 'app/services/localization';
// import { notifyBrowser } from 'app/util/notifyBrowser';

import {
	format,
	ItemFormatPayload,
} from 'app/mail/layout/FeedbackNotifyLayout';

import * as app from 'app/util/applib';

const log = app.createLog();

const cssFeedbackItemBox = [
	'padding: 0.8em',
	'margin-bottom: 0.5em',
].join(';');

export function layoutNotifyMail(
	article : Article,
	feedbacks : Feedback[],
	template : MailTemplate
) {
	const { locale } = article.website;

	const html : string = template.setParams({
		editorEscalation: __('mail.fb-notify.editor-escalation', {
			locale,
			values: {
				count: feedbacks.length,
			},
		}),
		ccEditor: __('mail.fb-notify.cc-editor', locale),

		articleTitle: format.articleTitle(article),
		debugInfo: debugInfo(article, feedbacks),
		feedbacks: formatFeedbacks(article, feedbacks, locale),
	})
	.render();

	// notifyBrowser(html);  // -- this is only for convenient local testing

	return Promise.resolve(html);
}

function formatFeedbacks(
	article : Article,
	feedbacks : Feedback[],
	locale : string
) : string[] {
	return feedbacks.map(fb => formatFeedback(article, fb, locale));
}

function formatFeedback(article : Article, feedback : Feedback, locale : string) : string {
	const d = new Date(feedback.date.created);
	const p = __('mail.fb-notify.posted', locale);
	const x = d.toLocaleDateString(locale);
	const y = d.toLocaleTimeString(locale);
	const head = `<div class="feedback-date">${p} ${x} ${y}</div>`;

	return head + (feedback.items
	.map((fItem, index) => {
		const item : ItemFormatPayload = {
			aItem: articleService.getRelatedArticleItem(feedback.article, fItem),
			fItem,
		};

		if (item.aItem === undefined) {
			log('Could not find related article item (feedback ID %s)', feedback.ID, app.inspect(fItem));
			return;
		}

		if (item.fItem.text === undefined) {
			log('Found a feedback object without text property, ignoring');
			return;
		}

		return formatFeedbackItem(item, locale);
	})
	.filter(item => item !== undefined)
	.join('\n'));
}

function formatFeedbackItem(item : ItemFormatPayload, locale : string) : string {
	const formatted = [
		format.itemHeader(item, locale),
		format.itemText(item),
		format.itemComment(item, locale),
		format.itemLinks(item, locale),
	];

	const borderCol = (item.fItem.text.length <= 0) ? format.colorItemText : format.colorItemDiff;
	const css = `${cssFeedbackItemBox}; border-left: 3px solid ${borderCol};`;
	return `<div class="fb-item-box" style="${css}">${formatted.join('')}</div>`;
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
