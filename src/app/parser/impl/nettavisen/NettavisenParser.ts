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

import * as Cheerio from 'cheerio';
import * as CheerioPlugin from '../../util/CheerioPlugin';

import ArticleAuthor from 'base/ArticleAuthor';
import ArticleItem from 'base/ArticleItem';

import AbstractIteratingParser from 'app/parser/AbstractIteratingParser';
import IteratingParserItem from 'app/parser/IteratingParserItem';

import { getLinkedDataAuthors } from 'app/parser/util/AuthorParser';
import { getLinkedDataModifiedTime } from 'app/parser/util/VersionParser';

export default class NettavisenParser extends AbstractIteratingParser {

	// Implement AbstractParser

	protected parseVersion() : Promise <string> {
		return Promise.resolve(getLinkedDataModifiedTime(this.select));
	}

	protected parseByline() : Promise <ArticleAuthor[]> {
		return Promise.resolve(getLinkedDataAuthors(this.select));
	}

	// Implement AbstractIteratingParser

	protected getArticleContentScope() : string {
		return 'article[id="article"]';
	}

	protected getParsedElementNames() : string[] {
		return [ 'h1', 'h3', 'p', 'img', 'div' ];
	}

	protected isMainTitle(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		const parents = select(item.elem).parents('div[id="article_top"]');

		return item.name === 'h1'
			&& parents.length === 1
			&& item.text.length > 0;
	}

	protected isLeadIn(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		return item.name === 'div'
			&& item.css.includes('leadtext')
			&& item.text.length > 0;
	}

	protected isFeaturedImage(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		const parents = select(item.elem).parents('div[id="article_top"]');

		return item.name === 'img'
			&& !item.css.includes('byline-img')
			&& parents.length === 1;
	}

	protected createFeaturedImage(
		fromItem : IteratingParserItem,
		select : Cheerio
	) : ArticleItem {
		const href = select(fromItem.elem).attr('src');
		const caption = CheerioPlugin.trimText(select(fromItem.elem).next('div.image_caption').text());
		return this.createFeaturedImageEl(href, caption);
	}

	protected isSubHeading(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		const parents = select(item.elem).parents('div.sidebar-element');
		return item.name === 'h3'
			&& parents.length === 0
			&& item.text.length > 0
			&& item.css.length === 0;
	}

	protected isParagraph(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		const withinArticleStory = select(item.elem).parents('div[id="article-story"]').length === 1;
		// First, check if we're inside <div id="article-story">
		if (!(item.name === 'p' && withinArticleStory)) {
			return false;
		}

		// There are several sub elements which contain plain <p> elements and which
		// do *not* belong to the article content. Check this element's parents:
		const checkParents = item.parents
			.filter(check => {
				return check.css.includes('article_services_skin');
			});

		return checkParents.length === 0;
	}

	protected isFigure(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		const parents = select(item.elem).parents('div.articleInlineImage');
		return item.name === 'img'
			&& parents.length === 1;
	}

	protected createFigure(
		fromItem : IteratingParserItem,
		select : Cheerio
	) : ArticleItem {
		const href = select(fromItem.elem).attr('src');
		const caption = CheerioPlugin.trimText(select(fromItem.elem)
			.parents('div.articleInlineImage')
			.find('div.dp-article-image-description').text());
			// caption_wrap / dp-article-image-description
		return this.createFigureEl(href, caption);
	}

}
