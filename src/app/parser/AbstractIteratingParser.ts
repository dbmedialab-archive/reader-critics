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

// tslint:disable: max-file-line-count

import * as Cheerio from 'cheerio';
import * as CheerioPlugin from './util/CheerioPlugin';

import ArticleItem from 'base/ArticleItem';
import ArticleItemType from 'base/ArticleItemType';

import ExtendedIteratingItems from 'app/parser/ExtendedIteratingItems';
import IteratingParserItem from 'app/parser/IteratingParserItem';

abstract class AbstractIteratingParser extends ExtendedIteratingItems {

	protected select : Cheerio;

	private parsedItems : Array <IteratingParserItem>;

	private articleItems : {
		featured: ArticleItem
		titles: Array <ArticleItem>
		content: Array <ArticleItem>
	};

	protected initialize() : Promise <void> {
		this.articleItems = Object.freeze({
			featured: undefined,
			titles: [],
			content: [],
		});

		return super.initialize()
		.then(() => CheerioPlugin.create(this.rawArticle))
		.then((cheeeer : Cheerio) => {
			this.select = cheeeer;
		});
	}

	protected parseContent() : Promise <ArticleItem[]> {
		this.parseElements();
		this.iterateParsedElements();
		return Promise.resolve(this.articleItems.content);
	}

	private parseElements() : void {
		this.parsedItems = this.select(
			this.getParsedElementNames().join(','),
			this.getContentScopeElement()
		)
		.toArray().map(elem => this.preprocessElement(elem));
	}

	private preprocessElement(elem : Cheerio, getParents : boolean = true) : IteratingParserItem {
		const preprocessed : IteratingParserItem = {
			// Some properties are collected and prefiltered here so access is easier
			name: elem.name,
			text: CheerioPlugin.formatText(elem),
			css: CheerioPlugin.splitCSS(this.select(elem).attr('class')),
			id: CheerioPlugin.getElemID(this.select(elem).attr('id')),
			// Reference the original Cheerio object here for advanced access
			elem,
		};
		// Provide an array of parent items
		if (getParents) {
			preprocessed.parents = this.select(elem)
			.parentsUntil(this.getArticleContentScope())
			.toArray()
			.map(parentEl => this.preprocessElement(parentEl, false));
		}

		return preprocessed;
	}

	private getContentScopeElement() : Cheerio {
		const scopeElArr = this.select(this.getArticleContentScope()).toArray();

		if (scopeElArr.length !== 1) {
			throw new Error('Could not identify a unique content scope element, '
			+ `DOM query returned ${scopeElArr.length} items`);
		}

		return scopeElArr[0];
	}

	private iterateParsedElements() : void {

		while (this.parsedItems.length > 0) {
			const item = this.parsedItems.shift();
			for (const key in ArticleItemType) {
				if (!ArticleItemType.hasOwnProperty(key)) { break; }
				const isFuncName = `is${key}`;
				const createFuncName = `create${key}`;
				if (this[isFuncName](item, this.select) && isFuncName.includes('Title')){
					this.pushNewTitleItem(this[createFuncName](item, this.select));
					break;
				} else if (this[isFuncName](item, this.select)) {
					this.pushNewContentItem(this[createFuncName](item, this.select));
					break;
				} else {
					this.checkOtherVariants(item, this.select);
				}
			}
		}
	}

	// Push new article items onto the various stacks

	protected pushNewContentItem(item : ArticleItem) : void {
		if (item !== undefined) {
			this.articleItems.content.push(item);
		}
	}

	protected pushNewTitleItem(item : ArticleItem) : void {
		if (item !== undefined) {
			this.articleItems.titles.push(item);
		}
	}

	// Implementing AbstractParser to return special kinds of parsed items

	protected parseTitles() : Promise <ArticleItem[]> {
		return Promise.resolve(this.articleItems.titles);
	}

	protected parseTitleFromMetaData() : Promise <string> {
		const meta = this.select('meta[name="title"]').toArray();

		if (meta.length === 1) {
			return Promise.resolve(this.select(meta[0]).attr('content'));
		}

		return Promise.resolve('');
	}

	// Nur zum Testen

	protected parseFeaturedImage() : Promise <ArticleItem[]> {
		return Promise.resolve([]);
	}

	// Defaults, can and probably should be overridden

	protected getArticleContentScope() : string {
		return 'body';
	}

	protected checkOtherVariants(
		item : IteratingParserItem,
		select : Cheerio
	) {
		// No further checks implemented at this point, all remaining items
		// are turned into a paragraph by default.
		// this.pushNewContentItem(this.createParagraph(item));
	}

	protected parseSectionTitle() : Promise <ArticleItem[]> {
		return Promise.resolve([]);
	}

	protected parseSectionParagraph() : Promise <ArticleItem[]> {
		return Promise.resolve([]);
	}
}

export default AbstractIteratingParser;
