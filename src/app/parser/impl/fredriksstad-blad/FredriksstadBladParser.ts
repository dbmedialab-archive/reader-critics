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

import { getOpenGraphModifiedTime } from 'app/parser/util/VersionParser';

import * as app from 'app/util/applib';
import {getArticleCategory} from 'app/parser/util/CategoryParser';

const log = app.createLog();

export default class FredriksstadBladParser extends AbstractIteratingParser {

	// Implement AbstractParser

	protected parseVersion() : Promise <string> {
		return Promise.resolve(getOpenGraphModifiedTime(this.select, true));
	}

	protected parseCategory() : Promise <string> {
		return Promise.resolve( '');
	}

	protected parseByline() : Promise <ArticleAuthor[]> {
		const authorMap : Array <ArticleAuthor> = [];

		const bylineEl = this.select('div.maelstrom-articleByline');
		const authorEL = this.select(bylineEl).find('a[itemprop="author"]').toArray();

		// List of authors with email addresses, those come in <a> elements
		authorEL.forEach(thisAuthorEl => {
			const name = this.select(thisAuthorEl).text().trim();
			const email = this.select(thisAuthorEl).attr('href').replace(/mailto:/, '').trim();

			authorMap.push({
				name,
				email,
			});
		});

		const externalsEl = this.select(bylineEl).find('span[itemprop="author"]').toArray();

		externalsEl.forEach(thisAuthorEl => {
			const name = this.select(thisAuthorEl).text().trim();

			authorMap.push({
				name,
				email: undefined,
			});
		});

		return Promise.resolve(authorMap);
	}

	// Implement AbstractIteratingParser

	protected getArticleContentScope() : string {
		return 'main#am-mainContent';
	}

	protected getParsedElementNames() : string[] {
		return [
			'h1',
			'h2',
			'p',
			'div',
			'figure',
		];
	}

	protected isMainTitle(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		return item.name === 'h1'
			&& select(item).attr('itemprop') === 'headline'
			&& item.text.length > 0;
	}

	protected isLeadIn(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		return item.name === 'div'
			&& item.css.includes('am-article-leadText')
			&& item.text.length > 0;
	}

	protected isFeaturedImage(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		if (!this.isFigure(item, select)) {
			return false;
		}

		log('### isFeaturedImage [ %s ]', item.parents.map(el => el.name).join());

		item.parents.forEach(el => {
			log('  <%s> %s', el.name, app.inspect(el.elem.attribs));
			// css.join(' '), select(el).attr('itemprop')
		});

		// Featured images are embedded in a <div itemprop="associatedMedia">
		// element; check the parents of this figure.
		return undefined !== item.parents.find((parentEl : IteratingParserItem) => {
			return parentEl.name === 'div'
				&& select(parentEl.elem).attr('itemprop') === 'associatedMedia';
		});
	}

	protected isSubHeading(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		return this.isInContentDiv(item)
			&& item.name === 'h2'
			&& item.text.length > 0;
	}

	protected isParagraph(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		return this.isInContentDiv(item)
			&& item.name === 'p'
			&& item.text.length > 0;
	}

	protected isFigure(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		return item.name === 'figure'
			&& select(item.elem).attr('itemtype') === 'http://schema.org/ImageObject';
	}

	protected isInContentDiv(item : IteratingParserItem) : boolean {
		const findParent = (parentEl : IteratingParserItem) =>
			parentEl.name === 'div' && parentEl.css.includes('content');

		return undefined !== item.parents.find(findParent);
	}

}
