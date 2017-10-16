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

import { concat } from 'lodash';

import diffToPlainHTML from 'base/diff/diffToPlainHTML';

import ArticleItem from 'base/ArticleItem';
import ArticleItemType from 'base/ArticleItemType';
import Feedback from 'base/Feedback';
import FeedbackItem from 'base/FeedbackItem';

import {
	systemLocale,
	translate as __,
} from 'app/services/localization';

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

const whenSentIn = (f : Feedback) =>
	`${__('label.sent-in')} ${f.date.created.toLocaleString(systemLocale)}`;

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

const cssItemTextGeneric = [
	'margin-bottom: 0.5em',
	'padding: 0.5em',
];

export const colorItemText = '#d6e1e8';

const cssItemText = concat(cssItemTextGeneric, [
	`background-color: ${colorItemText}`,
]).join(';');

export const colorItemDiff = '#c3e7ff';

const cssItemDiffText = concat(cssItemTextGeneric, [
	`background-color: ${colorItemDiff}`,
]).join(';');

const itemText = (i : ItemFormatPayload) => {
	if (i.fItem.text.length <= 0) {
		return `<div class="el-diff" style="${cssItemText}">${i.aItem.text}</div>`;
	}
	else {
		return `<div class="el-diff" style="${cssItemDiffText}">`
		+ diffToPlainHTML(i.aItem.text, i.fItem.text)
		+ '</div>';
	}
};

const itemLinks = (i : ItemFormatPayload) => {
	if (i.fItem.links.length <= 0) {
		return '';
	}

	let links = '';

	i.fItem.links.forEach(link => {
		links += `<li><a href="${link}">${link}</a></li>`;
	});

	return `<p style="margin: 0.4em 0;">${__('label.links')}:</p>`
	+ `<ul style="margin: 0;">${links}</ul>`;
};

// Main export

export const format = {
	articleTitle,
	colorItemText,
	colorItemDiff,
	enduser,
	itemComment,
	itemLinks,
	itemHeader,
	itemText,
	whenSentIn,
};
