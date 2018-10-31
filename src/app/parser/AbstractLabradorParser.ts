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

import ArticleAuthor from 'base/ArticleAuthor';

import AbstractIteratingParser from 'app/parser/AbstractIteratingParser';
import IteratingParserItem from 'app/parser/IteratingParserItem';

import { getOpenGraphAuthors } from 'app/parser/util/AuthorParser';
import { getOpenGraphModifiedTime } from 'app/parser/util/VersionParser';
import { getArticleCategory } from 'app/parser/util/CategoryParser';

abstract class AbstractLabradorParser extends AbstractIteratingParser {

	// Implement AbstractParser

	protected parseVersion() : Promise <string> {
		return Promise.resolve(getOpenGraphModifiedTime(this.select));
	}

	protected parseByline() : Promise <ArticleAuthor[]> {
		return Promise.resolve(getOpenGraphAuthors(this.select));
	}

	protected parseCategory() : Promise <string> {
		return Promise.resolve(getArticleCategory(this.select));
	}

	// Implement AbstractIteratingParser

	protected getArticleContentScope() : string {
		return 'main[role="main"]';
	}

	protected getParsedElementNames() : string[] {
		return [
			'h1',
			'h2',
			'p',
			'figure',
			'ul',
			'ol',
			'h5',
		];
	}
	protected elementWithinSection($element){
		return $element.parents('aside').hasClass('has-section-title');
	}

	protected elementAnnounce($element) {
		return  $element.hasClass('text-darkgrey')
			|| $element.parents('aside').hasClass('article-announce');
	}

	protected isMainTitle(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		const withinHeader = select(item.elem).parents('header').length === 1;

		return item.text.length > 0 && withinHeader
			&& (item.name === 'h1' || item.name === 'h2' )
			&& (select(item.elem).attr('itemprop') === 'headline');
	}

	protected isSubTitle(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		const withinHeader = select(item.elem).parents('header').length === 1;

		return item.text.length > 0 && withinHeader
			&& (item.name === 'h1' || item.name === 'h2')
			&& (select(item.elem).attr('itemprop') === 'alternativeHeadline');
	}

	protected isLeadIn(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		const $element = select(item.elem);

		return item.name === 'p'
			&& $element.attr('itemprop') === 'description'
			&& $element.hasClass('standfirst')
			&& item.text.length > 0;
	}

	protected isFeaturedImage(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		// Fail-fast if this isn't a figure element
		if (!this.isFigure(item, select)) {
			return false;
		}

		// The only way to figure out if a <figure> is a featured image on
		// Labrador CMS is to look at its parent element. If by climbing up the
		// DOM tree we find a <header> element, then this is a featured image.
		// If that container is missing, it's just a plain inline figure.
		const parents : string[] = select(item.elem)
			.parentsUntil(this.getArticleContentScope())
			.toArray()
			.map(thisEl => thisEl.name);

		return parents.includes('header');
	}

	protected isSubHeading(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		return item.name === 'h2'
			&& item.text.length > 0
			&& item.css.length === 0;
	}

	protected isParagraph(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		const $element = select(item.elem);
		const withinArticle = $element.parents('article').length === 1;

		return item.name === 'p'
			&& withinArticle
			&& !this.elementWithinSection($element)
			&& !this.elementAnnounce($element)
			&& item.text.length > 0;
	}

	protected isFigure(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		// Check if a video element is present, then this doesn't count as an image/figure
		const hasVideo : boolean = select(item.elem).children('div[class="flex-video"]').length === 1;

		return !hasVideo
			&& item.name === 'figure'
			&& select(item.elem).attr('itemtype') === 'http://schema.org/ImageObject';
	}

	protected isSectionParagraph(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		const $element = select(item.elem);

		return (item.name === 'p' || item.name === 'ul' ||  item.name === 'ol' )
			&& this.elementWithinSection($element)
			&& !this.elementAnnounce($element)
			&& item.text.length > 0;
	}

	protected isSectionTitle(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		const $element = select(item.elem);

		return item.name === 'h5'
			&& item.css.includes('section-title')
			&& this.elementWithinSection($element)
			&& !this.elementAnnounce($element)
			&& item.text.length > 0;
	}

}

export default AbstractLabradorParser;
