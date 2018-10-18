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

import * as React from 'react';

import ArticleItemType from 'base/ArticleItemType';
import FeedbackContainer from 'front/feedback/FeedbackContainer';

import FeaturedImageElement from './article-el/FeaturedImageElement';
import FigureElement from './article-el/FigureElement';
import LeadInElement from './article-el/LeadInElement';
import LinkElement from './article-el/LinkElement';
import MainTitleElement from './article-el/MainTitleElement';
import ParagraphElement from './article-el/ParagraphElement';
import SubHeadingElement from './article-el/SubHeadingElement';
import SubTitleElement from './article-el/SubTitleElement';
import SectionTitleElement from './article-el/SectionTitleElement';
import SectionParagraphElement from './article-el/SectionParagraphElement';
import TestResultTitleElement from './article-el/TestResultTitleElement';
import TestResultQuoteElement from './article-el/TestResultQuoteElement';
import TestResultProsElement from './article-el/TestResultProsElement';
import TestResultConsElement from './article-el/TestResultConsElement';

const elTypes = Object.freeze({
	[ArticleItemType.FeaturedImage]: FeaturedImageElement,
	[ArticleItemType.Figure]: FigureElement,
	[ArticleItemType.LeadIn]: LeadInElement,
	[ArticleItemType.Link]: LinkElement,
	[ArticleItemType.MainTitle]: MainTitleElement,
	[ArticleItemType.Paragraph]: ParagraphElement,
	[ArticleItemType.SubHeading]: SubHeadingElement,
	[ArticleItemType.SubTitle]: SubTitleElement,
	[ArticleItemType.SectionParagraph]: SectionParagraphElement,
	[ArticleItemType.SectionTitle]: SectionTitleElement,
	[ArticleItemType.TestResultTitle]: TestResultTitleElement,
	[ArticleItemType.TestResultQuote]: TestResultQuoteElement,
	[ArticleItemType.TestResultPros]: TestResultProsElement,
	[ArticleItemType.TestResultCons]: TestResultConsElement,

});

export default function (
	container : FeedbackContainer,
	articleItem : any,
	refFn : (i : any) => void
) : JSX.Element
{
	if (articleItem === undefined ? true : articleItem.type === undefined) {
		return null;
	}

	const key = `element-${articleItem.order.item}`;
	const { text, ...item } = articleItem;
	const component = elTypes[item.type];

	if (component === undefined) {
		console.log(`Article item type ${item.type} is not mapped to a component`);
		return <div>Unknown element type</div>;
	}

	item.originalText = text;

	return React.createElement(component, {
		key,
		ref: refFn,
		item,
		container,
	});
}
