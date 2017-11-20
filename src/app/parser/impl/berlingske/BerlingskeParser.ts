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
import ArticleItem from 'base/ArticleItem';

import {
	default as AbstractIteratingParser,
	IteratingParserItem,
} from '../../AbstractIteratingParser';

import { getOpenGraphAuthors } from '../../util/AuthorParser';
import { getOpenGraphModifiedTime } from '../../util/VersionParser';

export default class BerlingskeParser extends AbstractIteratingParser {

	// Implement AbstractParser

	protected parseVersion() : Promise <string> {
		return Promise.resolve(getOpenGraphModifiedTime(this.cheerio));
	}

	protected parseByline() : Promise <ArticleAuthor[]> {
		/*const authors = getOpenGraphAuthors(this.select);
		log('parsing byline:', authors);*/
		return Promise.resolve([]);
	}

	// Implement AbstractIteratingParser

	protected getArticleContentScope() : string {
		// return 'div#content.main-content';
		return 'div#content.main-content';
	}

	protected getParsedElementNames() : string[] {
		return [
			'h1',
			'h2',
			'p',
			'figure',
		];
	}

	protected isMainTitle(item : IteratingParserItem) : boolean {
		return item.name === 'h1'
			&& item.css.includes('article-header__title')
			&& item.text.length > 0;
	}

	protected isSubTitle(item : IteratingParserItem) : boolean {
		return false;
	}

	protected isLeadIn(item : IteratingParserItem) : boolean {
		return item.name === 'p'
			&& item.css.includes('article-header__summary')
			&& item.text.length > 0;
	}

	protected isParagraph(item : IteratingParserItem) : boolean {
		return item.name === 'p' && item.text.length > 0;
	}

	protected isFigure(item : IteratingParserItem) : boolean {
		return item.name === 'figure'
			&& this.cheerio(item.elem).attr('itemtype') === 'http://schema.org/ImageObject';
	}

	protected createFigure(fromItem : IteratingParserItem) : ArticleItem {
		const imgEl = this.cheerio('img', fromItem.elem);
		const capEl = this.cheerio('figcaption', fromItem.elem);

		const imgSrc = this.cheerio(imgEl).attr('src');
		const altTxt = this.cheerio(capEl).text().trim();

		return this.createFigureEl(imgSrc, altTxt);
	}

}
