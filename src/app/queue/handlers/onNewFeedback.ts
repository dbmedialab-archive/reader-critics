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

import Article from 'base/Article';
import ArticleItem from 'base/ArticleItem';
import Feedback from 'base/Feedback';
import FeedbackItem from 'base/FeedbackItem';
import MailTemplate from 'app/template/MailTemplate';
import Website from 'base/Website';

import { ObjectID } from 'app/db';

import {
	feedbackService,
	localizationService,
	templateService,
	websiteService,
} from 'app/services';

import {
	format,
	ItemFormatPayload,
} from 'app/mail/layout/FeedbackNotifyLayout';

import SendGridMailer from 'app/mail/sendgrid/SendGridMailer';

import * as app from 'app/util/applib';

const __ = localizationService.translate;
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
			log(app.inspect(website));

			// return layoutNotifyMail ...
		})

		// 	layoutNotifyMail)
		// .then((htmlMailContent : string) => {
		// 	const recipients = getRecipients
		// 	log(htmlMailContent);
		// 	return SendGridMailer('philipp@sol.no', 'Leserkritikk', htmlMailContent);
		// 	// Here be the sending of the mail. This is solved in feature/mail-sendgrid
		// })
		.then(() => {
			done();
			resolve();
		})
		.catch(reject);
	});
}

const cssFeedbackItemBox = [
	'padding: 0.8em',
	'margin-bottom: 0.5em',
].join(';');

function layoutNotifyMail(feedback : Feedback, template : MailTemplate) : Promise <any> {
	let dtxt = '';

	feedback.items.forEach((fItem : FeedbackItem, fIndex : number) => {
		const i : ItemFormatPayload = {
			aItem: getRelatedArticleItem(feedback.article, fItem),
			fItem,
		};

		const formatted = [
			format.itemHeader(i),
			format.itemText(i),
			format.itemComment(i),
			format.itemLinks(i),
		];

		const borderCol = (fItem.text.length <= 0) ? format.colorItemText : format.colorItemDiff;
		const css = `${cssFeedbackItemBox}; border-left: 3px solid ${borderCol};`;
		dtxt += `<div class="fb-item-box" style="${css}">${formatted.join('')}</div>`;
	});

	const html = template.setParams({
		gotFeedback: __('mail.fb-notify.got-feedback'),
		whoSent: __('mail.fb-notify.who-sent'),

		articleTitle: format.articleTitle(feedback),
		enduser: format.enduser(feedback),
		sentIn: format.whenSentIn(feedback),

		debugInfo: debugInfo(feedback),

		feedbackBox: dtxt,
	})
	.render();

	// notifyBrowser(html);  -- this is only for convenient local testing

	return Promise.resolve(html);
}

function getRelatedArticleItem(article : Article, fItem : FeedbackItem) {
	return article.items.find((aItem : ArticleItem) => {
		return aItem.order.item === fItem.order.item
			&& aItem.order.type === fItem.order.type
			&& aItem.type === fItem.type;
	});
}

function debugInfo(feedback : Feedback) : string {
	return [
		`feedback ID = ${feedback.ID}`,
		`article ID = ${feedback.article.ID}`,
		`article version = ${feedback.article.version}`,
	].join('<br/>');
}

// Only for development

/*
import { writeFileSync } from 'fs';
import { spawn } from 'child_process';

function notifyBrowser(html : string) {
	const testPath = '/tmp/mailtest.html';

	writeFileSync(testPath, html, {
		flag: 'w',
		mode: 0o644,
	});

	spawn('/usr/bin/qupzilla', [ '-c', `file://${testPath}` ], {
		detached: true,
	});
}
*/
