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

import AbstractLabradorParser from 'app/parser/AbstractLabradorParser';
import IteratingParserItem from 'app/parser/IteratingParserItem';
import {cfEmailDecode} from 'app/parser/util/EmailDecode';

export default class SolParser extends AbstractLabradorParser {

	// Implement AbstractParser

	protected parseVersion() : Promise <string> {
		return Promise.resolve(
			this.select('div.meta').find('meta[itemprop="dateModified"]').attr('content')
		);
	}

	protected parseByline() : Promise <ArticleAuthor[]> {
		const authorWrap = this.select('div.byline').find('span.person').toArray();
		return Promise.resolve(authorWrap.map(wrap => {
			const name = ''.concat(this.select(wrap).find('span.name').find('span.firstname').text(),
				this.select(wrap).find('span.name').find('span.lastname').text());
			const encodedMail = this.select(wrap).find('a[rel="author"]').attr('href');
			const mail = cfEmailDecode(encodedMail.replace('/cdn-cgi/l/email-protection#', ''));
			return {
				name,
				email: mail === undefined ? undefined : mail,
			};
		}));
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
			&& hasParentDescription
			&& item.text.length > 0;
	}

}
