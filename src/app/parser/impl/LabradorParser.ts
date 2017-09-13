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
import Article from 'base/Article';

import GenericParser from './GenericParser';

import * as app from 'app/util/applib';
import {getContent, ProvidedContent} from 'app/parser/util/labradorparser/ProvidedContent';
import ArticleItemType from 'base/ArticleItemType';
import ArticleAuthor from 'base/ArticleAuthor';
import ArticleItem from 'base/ArticleItem';

const log = app.createLog();

interface ParserWorkflow {
	version : any;
	authors : any;
	url: any;
	items : any;
}

export default class LabradorParser extends GenericParser {

	protected select : Cheerio;
	protected jsonArticle: any;
	private resultData : ParserWorkflow;

	/**
	 * Derived method that is called by parser factory
	 */
	parse() : Promise <Article> {
		return this.init()
		.then(() => {
			const providedContent = this.getProvidedContent();
			const jsonContent = this.getParsedContent();

			return this.finalizeAnswer(jsonContent, providedContent);
		})
		.catch((error) => {
			return Promise.reject(error);
		});
	}

	/**
	 * Simple response validation is here.
	 * Also sets jsonArticle property.
	 */
	init() : Promise <any> {
		if (this.validateApiResponse(this.rawArticle)) {
			this.jsonArticle = this.rawArticle.result[0];
			return Promise.resolve();
		}
		const error = 'Bad source response';
		log(error);
		return Promise.reject(new Error(error));
	}

	/**
	 * Validating response
	 */
	validateApiResponse(rawArticle): boolean {
		if (!rawArticle.result || ! Array.isArray(rawArticle.result) ) {
			return false;
		}
		if (rawArticle.result.length !== 1 || !rawArticle.result[0]) {
			return false;
		}

		return true;
	}

	/**
	 * We still have html content that should be parsed as usual.
	 */
	getParsedContent() {
		if (this.jsonArticle.bodytextHTML && this.jsonArticle.bodytextHTML) {
			const $ = Cheerio.load(this.jsonArticle.bodytextHTML);
			const items = [];
			$('*').each((i, elem) => {
				let item;
				switch (elem.name) {
					case 'h2':
					case 'h3':
					case 'h4':
					case 'h5':
					case 'h6':
						item = this.createSubHeadingEl($(elem).text());
						break;
					case 'a':
						item = this.createLinkEl(elem.attribs.href, $(elem).text());
						break;
					case 'body':
						break;
					case 'head':
						break;
					case 'html':
						break;
					case 'p':
					default:
						item = this.createParagraphEl($(elem).text());
						break;
				}
				if (item !== undefined) {
					items.push(item);
				}
			});
			return items;
		}

		return [];
	}

	/**
	 * Fetch data that shouldn't be parsed, but can be used directly from
	 * JSON object.
	 */
	getProvidedContent() {
		const content : ProvidedContent = getContent(this.jsonArticle);
		return content;
	}

	/**
	 * Putting together parsed and provided content,
	 * other formatting routines.
	 */
	finalizeAnswer (parsedContent, providedContent) : Promise <Article> {
		for (const key in parsedContent) {
			delete parsedContent[key].order;
		}
		if (providedContent.subtitle) {
			parsedContent.unshift(providedContent.subtitle);
		}
		if (providedContent.title) {
			parsedContent.unshift(providedContent.title);
		}
		if (providedContent.image) {
			parsedContent = parsedContent.concat(providedContent.image);
		}
		if (providedContent.video) {
			parsedContent = parsedContent.concat(providedContent.video);
		}

		this.resultData = {
			items: this.setOrder(parsedContent),
			version: providedContent.version,
			authors: providedContent.authors,
			url: this.articleURL,
		};

		return this.getResult();
	}

	/**
	 * Parsed content returns entries with property "order"
	 * need to reorder it for provided content as well.
	 */
	setOrder (items) {
		const elementTypeCounts = {};
		let totalElementCount = 0;
		Object.values(ArticleItemType).forEach(t => elementTypeCounts[t] = 0);
		return items.map((entry) => {
			entry.order = {
				item: ++ totalElementCount,
				type: ++ elementTypeCounts[entry.type],
			};

			return entry;
		});
	}

	/**
	 * Responds with Article promise
	 */
	getResult() : Promise <Article> {
		const workflow : ParserWorkflow = {
			version: this.parseVersion(),
			authors: this.parseByline(),
			url: this.articleURL,
			items: this.parseContent(),
		};

		return Promise.resolve(Promise.props(workflow))
		.then((a : ParserWorkflow) : Article => {
				return ({
					url: a.url,
					version: a.version,
					authors: a.authors,
					items: a.items,
				});
			}
		);
	}

	/**
	 * Byline promise
	 */
	protected parseByline () : Promise <ArticleAuthor[]> {
		return Promise.resolve(this.resultData.authors);
	}

	/**
	 * Items promise
	 */
	protected parseContent () : Promise <ArticleItem[]> {
		return Promise.resolve(this.resultData.items);
	}

	/**
	 * Version promise
	 */
	protected parseVersion () : Promise <string> {
		return Promise.resolve(this.resultData.version);
	}

}
