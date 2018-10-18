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
import AbstractLabradorParser from 'app/parser/AbstractLabradorParser';
import IteratingParserItem from 'app/parser/IteratingParserItem';

export default class DinsideParser extends AbstractLabradorParser {

	protected getParsedElementNames() : string[] {
		const parsedElementsNames: string[] = super.getParsedElementNames();
		parsedElementsNames.push('blockquote');

		return parsedElementsNames;
	}

	protected elementWithinReview($element){
		return $element
			.parents('.review-box.culture-review-box')
			.parent()
			.attr('itemprop') === 'itemReviewed';
	}

	protected elementPrisjakt($element){
		return $element.parents('aside').parent().attr('itemprop') === 'itemReviewed';
	}

	protected isTestResultTitle(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		const $element = select(item.elem);

		return  $element.hasClass('review-name') && this.elementWithinReview($element);
	}

	protected isTestResultQuote(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		return item.name === 'blockquote' && this.elementWithinReview(select(item.elem));
	}

	protected isTestResultPros(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		const $element = select(item.elem);

		return item.name === 'p'
			&& $element.attr('itemprop') === 'description'
			&& $element.hasClass('review-pros')
			&& this.elementWithinReview($element);
	}

	protected isTestResultCons(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		const $element = select(item.elem);

		return item.name === 'p'
			&& $element.attr('itemprop') === 'description'
			&& $element.hasClass('review-cons')
			&& this.elementWithinReview($element);
	}

	protected isParagraph(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		const $element = select(item.elem);
		const isParagraphSuper: boolean = super.isParagraph(item, select);

		return isParagraphSuper
			&& !this.elementPrisjakt($element)
			&& !this.elementWithinReview($element);
	}

}
