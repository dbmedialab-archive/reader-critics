import Article from 'base/Article';
import Feedback from 'base/Feedback';

import { articleService }  from 'app/services';
import { translate as __ } from 'app/services/localization';

import {
	format,
	ItemFormatPayload,
} from 'app/mail/layout/FeedbackNotifyLayout';

import * as app from 'app/util/applib';

const cssFeedbackItemBox = [
	'padding: 0.25em 0.5em',
	'margin-bottom: 0.5em',
].join(';');

export function formatFeedbacks(
	article : Article,
	feedbacks : Feedback[],
	locale : string
) : string[] {
	return feedbacks.map(fb => formatFeedback(article, fb, locale));
}

export function formatFeedback(
	article : Article,
	feedback : Feedback,
	locale : string
) : string
{
	console.log(app.inspect(feedback));
	const created = new Date(feedback.date.created);

	const posted = __('mail.fb-notify.posted', {
		locale,
		values: {
			createdDate: created.toLocaleDateString(locale),
			createdTime: created.toLocaleTimeString(locale),
			enduser: format.enduser(feedback),
		},
	});

	const head = `<div class="feedback-date">${posted}</div>`;

	return head + (feedback.items
	.map((fItem, index) => {
		const item : ItemFormatPayload = {
			aItem: articleService.getRelatedArticleItem(article, fItem),
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
