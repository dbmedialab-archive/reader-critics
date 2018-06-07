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

import BaseIteratingItems from 'app/parser/BaseIteratingItems';
import IteratingParserItem from 'app/parser/IteratingParserItem';

abstract class AbstractIteratingParser extends BaseIteratingItems {

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
			text: CheerioPlugin.trimText(this.select(elem).text()),
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

			if (this.isMainTitle(item, this.select)) {
				this.pushNewTitleItem(this.createMainTitle(item, this.select));
			}
			else if (this.isSubTitle(item, this.select)) {
				this.pushNewTitleItem(this.createSubTitle(item, this.select));
			}

			else if (this.isLeadIn(item, this.select)) {
				this.pushNewContentItem(this.createLeadIn(item, this.select));
			}

			else if (this.isFeaturedImage(item, this.select)) {
				this.pushNewContentItem(this.createFeaturedImage(item, this.select));
			}

			else if (this.isSubHeading(item, this.select)) {
				this.pushNewContentItem(this.createSubHeading(item, this.select));
			}

			else if (this.isParagraph(item, this.select)) {
				this.pushNewContentItem(this.createParagraph(item, this.select));
			}

			else if (this.isFigure(item, this.select)) {
				this.pushNewContentItem(this.createFigure(item, this.select));
			}

			else if (this.isLink(item, this.select)) {
				this.pushNewContentItem(this.createLink(item, this.select));
			}

			else {
				this.checkOtherVariants(item, this.select);
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

}

export default AbstractIteratingParser;
