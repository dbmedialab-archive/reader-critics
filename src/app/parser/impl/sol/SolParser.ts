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
import { getOpenGraphAuthors } from 'app/parser/util/AuthorParser';

import AbstractLabradorParser from 'app/parser/AbstractLabradorParser';
import IteratingParserItem from 'app/parser/IteratingParserItem';
import {cfEmailDecode} from 'app/parser/util/EmailDecode';
import {getOpenGraphModifiedTime} from 'app/parser/util/VersionParser';

export default class SolParser extends AbstractLabradorParser {

	// Implement AbstractParser

	protected getParsedElementNames() : string[] {
		return [
			'h1',
			'h2',
			'p',
			'figure',
			'li',
			'h5',
		];
	}

	protected parseVersion() : Promise <string> {
		const version = getOpenGraphModifiedTime(this.select);

		if (version !== undefined ){
			return Promise.resolve(version);
		} else {
			return Promise.resolve(
				this.select('div.meta').find('meta[itemprop="dateModified"]').attr('content')
			);
		}
	}

	protected parseByline() : Promise <ArticleAuthor[]> {
		const authors = getOpenGraphAuthors(this.select);

		if (authors.length !== 0) {
			return Promise.resolve(authors);
		} else {
			const authorWrap = this.select('div.byline').find('span.person').toArray();
			return Promise.resolve(authorWrap.map(wrap => {
				const name = this.select(wrap).find('span.name').text();
				const encodedMail = this.select(wrap).find('a[rel="author"]').attr('href');
				let mail;

				if (encodedMail.includes('mailto:')) {
					mail = encodedMail.replace('mailto:', '');
				} else if (encodedMail.includes('/cdn-cgi/l/email-protection#')) {
					mail = cfEmailDecode(encodedMail.replace('/cdn-cgi/l/email-protection#', ''));
				}

				return {
					name:  name === undefined ? undefined : name.replace(/\s+/g, ' '),
					email: mail,
				};
			}));
		}
	}

	// Implement AbstractIteratingParser

	protected getArticleContentScope() : string {
		return 'main';
	}

	protected isLeadIn(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		const hasParentDescription = select(item.elem).parents('div').attr('itemprop') === 'description';
		return item.name === 'p'
			&& (hasParentDescription || select(item.elem).attr('itemprop') === 'description')
			&& item.text.length > 0;
	}

	protected isSubHeading(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		return (item.name === 'h2' && item.css.length === 0
			|| item.name ==='h5' && item.css.includes('section-title'))
			&& item.text.length > 0;
	}

	protected isParagraph(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		const withinArticle = select(item.elem).parents('article').length === 1;
		const isTags = select(item.elem).parents('ul').attr('itemprop') === 'keywords';
		const isBreadCrumbs = select(item.elem).parents('div').hasClass('pageheader');

		return (item.name === 'p'
			|| (item.name === 'li' && withinArticle && !isTags && !isBreadCrumbs))
			&& item.text.length > 0;
	}

}
