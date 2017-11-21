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

import ArticleItem from 'base/ArticleItem';
import Parser from 'base/Parser';

import AbstractParser from './AbstractParser';
import IteratingParserItem from './IteratingParserItem';

abstract class BaseIteratingItems extends AbstractParser implements Parser {

	// Prototypes for overriding parser implementations

	protected abstract getParsedElementNames() : string[];

	protected abstract isMainTitle(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean;

	protected abstract isSubTitle(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean;

	protected abstract isLeadIn(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean;

	protected abstract isFeaturedImage(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean;

	protected abstract isFigure(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean;

	protected abstract isParagraph(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean;

	// Default implementations of methods that create an ArticleItem
	// from a (complex) parsed item of the iterator. Most item types should work
	// fine with these implementations as long as getting to their actual content
	// is just copying their text contents.

	protected createMainTitle(
		fromItem : IteratingParserItem,
		select : Cheerio
	) : ArticleItem {
		return this.createMainTitleEl(fromItem.text);
	}

	protected createSubTitle(
		fromItem : IteratingParserItem,
		select : Cheerio
	) : ArticleItem {
		return this.createSubTitleEl(fromItem.text);
	}

	protected createLeadIn(
		fromItem : IteratingParserItem,
		select : Cheerio
	) : ArticleItem {
		return this.createLeadInEl(fromItem.text);
	}

	protected createParagraph(
		fromItem : IteratingParserItem,
		select : Cheerio
	) : ArticleItem {
		return this.createParagraphEl(fromItem.text);
	}

	// The more advanced item types

	private getFigureData(
		fromItem : IteratingParserItem,
		select : Cheerio
	) : { imgSrc : string, altTxt : string }
	{
		const imgEl = select('img', fromItem.elem);
		const capEl = select('figcaption', fromItem.elem);

		return {
			imgSrc: select(imgEl).attr('src'),
			altTxt: select(capEl).text().replace(/Vis mer/, '').trim(),
		};
	}

	protected createFeaturedImage(
		fromItem : IteratingParserItem,
		select : Cheerio
	) : ArticleItem {
		const figure = this.getFigureData(fromItem, select);
		return this.createFeaturedImageEl(figure.imgSrc, figure.altTxt);
	}

	protected createFigure(
		fromItem : IteratingParserItem,
		select : Cheerio
	) : ArticleItem {
		const figure = this.getFigureData(fromItem, select);
		return this.createFigureEl(figure.imgSrc, figure.altTxt);
	}

}

export default BaseIteratingItems;
