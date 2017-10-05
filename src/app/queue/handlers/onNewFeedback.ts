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

import * as fs from 'fs';

import {
	DoneCallback,
	// !!! Job,
} from 'kue';

import { spawn } from 'child_process';

import Article from 'base/Article';
import ArticleItem from 'base/ArticleItem';
import Feedback from 'base/Feedback';
import FeedbackItem from 'base/FeedbackItem';
import MailTemplate from 'app/template/MailTemplate';

import diffToPlainHTML from 'base/diff/diffToPlainHTML';

import {
	feedbackService,
	localizationService,
	templateService,
} from 'app/services';

// !!! import SendGridMailer from 'app/mail/sendgrid/SendGridMailer';

import * as app from 'app/util/applib';

const __ = localizationService.translate;
const log = app.createLog();
/* !!! */ const testPath = '/tmp/mailtest.html';

type ItemFormatPayload = {
	aItem : ArticleItem;
	fItem : FeedbackItem;
};

export default function(job : any /*Job*/, done : DoneCallback) : Promise <void> {
	if (!job.data.ID) {
		log('Feedback "ID" not found in job data');
		return Promise.resolve();
	}

	const ID : string = job.data.ID;
	log(`Received new feedback event for ID ${ID}`);
	log(app.inspect(job.data));

	return new Promise <void> ((resolve, reject) => {
		Promise.all([
			feedbackService.getByID(ID),
			templateService.getFeedbackNotifyTemplate(),
		])
		.spread(processFeedback)
		.then(() => {
			done();
			resolve();
		})
		.catch(reject);
	});
}

const cssFeedbackItemBox = [
	'box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3)',
	'padding: 0.8em',
	'margin-bottom: 0.5em',
].join('; ');

function processFeedback(feedback : Feedback, template : MailTemplate) : Promise <any> {
	log('#### DIFF HTML ###############################################');

	let dtxt = '';

	feedback.items.forEach((fItem : FeedbackItem, fIndex : number) => {
		const i : ItemFormatPayload = {
			// TODO check undefined return value
			aItem: getRelatedArticleItem(feedback.article, fItem),
			fItem,
		};

		const formatted = [
			formatElHeader(i),
			formatElDiffText(i),
			formatElComment(i),
		];

		dtxt += `\n<!-- begin item no. ${fIndex} -->`
			+ `<div class="fb-item-box" style="${cssFeedbackItemBox}">`
			+ '\n' + formatted.join('')
			+ '\n</div>\n';
	});

	dtxt += '\n<!-- end of loop -->\n';

	const html = template.setParams({
		articleLink: `<a href="${feedback.article.url}">${feedback.article.url}</a>`,
		enduserName: `${feedback.enduser.name} (${feedback.enduser.email})`,
		testdiv: dtxt,
	})
	.render();

	log(html);
	fs.writeFileSync(testPath, html, {
		flag: 'w',
		mode: 0o644,
	});

	log('##############################################################');
	notifyBrowser();

	return Promise.resolve();
}

function getRelatedArticleItem(article : Article, fItem : FeedbackItem) {
	return article.items.find((aItem : ArticleItem) => {
		return aItem.order.item === fItem.order.item
			&& aItem.order.type === fItem.order.type
			&& aItem.type === fItem.type;
	});
}

// Formatting

const formatElHeader = (i : ItemFormatPayload) => {
	return '<label class="item-type">'
	+ __(`article-el.${i.aItem.type}`, {
		values: {
			order: i.aItem.order.type,
		},
	})
	+ ` &nbsp; <i>(${i.aItem.type})</i></label>`;
};

const cssElDiffText = [
	'border: 1px solid red',
	'margin-bottom: 0.4cm',
].join('; ');

const formatElDiffText = (i : ItemFormatPayload) => {
	return (i.fItem.text.length <= 0) ? ''
		: `<div class="el-diff" style="${cssElDiffText}">`
		+ diffToPlainHTML(i.aItem.text, i.fItem.text)
		+ '</div>';
};

const formatElComment = (i : ItemFormatPayload) => {
	return (i.fItem.comment.length <= 0) ? ''
		: '<div class="el-comment">' + __('label.comment') + ': <i>'
		+ i.fItem.comment
		+ '</i></div>';
};

// Only for development - TODO remove before merging!

function notifyBrowser() {
	spawn('/usr/bin/qupzilla', [ '-c', `file://${testPath}` ], {
		detached: true,
	});
}
