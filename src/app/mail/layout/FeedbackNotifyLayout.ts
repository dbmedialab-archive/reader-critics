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

import diffToPlainHTML from 'base/diff/diffToPlainHTML';

import ArticleItem from 'base/ArticleItem';
import ArticleItemType from 'base/ArticleItemType';
import Feedback from 'base/Feedback';
import FeedbackItem from 'base/FeedbackItem';

import { translate as __ } from 'app/services/localization';

export type ItemFormatPayload = {
	aItem : ArticleItem;
	fItem : FeedbackItem;
};

// Formatting - General

const articleTitle = (f : Feedback) => {
	const url = f.article.url;
	const ttl = f.article.items.find((i : ArticleItem) => i.type === ArticleItemType.MainTitle).text;

	return `<a href="${url}">${ttl}</a>`;
};

const enduser = (f : Feedback) => {
	const n = f.enduser.name;
	const m = f.enduser.email;

	return `${n} (<a href="mailto:${m}">${m}</a>)`;
};

// Formatting - Article Items

const itemComment = (i : ItemFormatPayload) =>
	(i.fItem.comment.length <= 0) ? ''
		: '<div class="el-comment">' + __('label.comment') + ': <i>'
		+ i.fItem.comment
		+ '</i></div>';

const cssItemHeader = [
	'text-transform: uppercase',
	'color: #597e97',
	'font-size: 0.8em',
	'margin-bottom: 0.5em',
].join(';');

const itemHeader = (i : ItemFormatPayload) =>
	`<div class="item-type" style="${cssItemHeader}">`
	+ __(`article-el.${i.aItem.type}`, {
		values: {
			order: i.aItem.order.type,
		},
	})
	+ '</div>';

const cssItemDiffText = [
	'margin-bottom: 0.5em',
	'background-color: #c3e7ff',
	'padding: 0.5em',
].join(';');

const itemText = (i : ItemFormatPayload) =>
	(i.fItem.text.length <= 0) ? ''
		: `<div class="el-diff" style="${cssItemDiffText}">`
		+ diffToPlainHTML(i.aItem.text, i.fItem.text)
		+ '</div>';

// Main export

export const format = {
	articleTitle,
	enduser,
	itemComment,
	itemHeader,
	itemText,
};
