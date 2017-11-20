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

import Article from 'base/Article';
import ArticleAuthor from 'base/ArticleAuthor';
import ArticleItem from 'base/ArticleItem';
import ArticleURL from 'base/ArticleURL';
import Parser from 'base/Parser';

import BaseElements from './BaseElements';

import * as app from 'app/util/applib';

const log = app.createLog();

interface ParserWorkflowPayload {
	version : any;
	authors : any;
	titles : any;
	featured : ArticleItem[]
}

abstract class AbstractParser extends BaseElements implements Parser {

	constructor(
		protected readonly rawArticle : string,
		protected readonly articleURL : ArticleURL
	) {
		super();
	}

	parse() : Promise <Article> {
		log('parse');
		return this.initialize().then(() => this.parseArticle());
	}

	/**
	 * Parser initialization. Override this with your own code if you need
	 * some asynchronous bootstrap functions to run before the parser will
	 * be ready. Don't forget to return a Promise! (void return value)
	 */
	protected initialize() : Promise <void> {
		return Promise.resolve();
	}

	/**
	 * Parser workflow. Taken out of parse() for readability.
	 */
	private parseArticle() : Promise <Article> {
		let content : Array<ArticleItem>;

		// First the handler that parses all the content is called. Each implementing
		// parser has the freedom to extract *all* necessary items (like titles, etc)
		// in this step already. Sometimes or for some page structures, this might
		// even be necessary. Intermediate results can then be stored inside the
		// parser instance and just be returned/resolved in f.ex. parseTitles().
		return this.parseContent()
		.then(items => {
			content = items;

			return Promise.props({
				version: this.parseVersion(),
				authors: this.parseByline(),
				titles: this.parseTitles(),
				featured: this.parseFeaturedImage(),
			});
		})
		.then((a : ParserWorkflowPayload) : Article => ({
			url: this.articleURL,
			version: a.version,
			authors: a.authors,
			items: [
				...a.titles,
				...a.featured,
				...content,
			],
		}));
	}

	// Prototypes

	protected abstract parseVersion() : Promise <string>;
	protected abstract parseByline() : Promise <ArticleAuthor[]>;
	protected abstract parseTitles() : Promise <ArticleItem[]>;
	protected abstract parseFeaturedImage() : Promise <ArticleItem[]>;
	protected abstract parseContent() : Promise <ArticleItem[]>;

}

export default AbstractParser;
