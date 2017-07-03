import * as Cheerio from 'cheerio';

import Article from 'base/Article';
import ArticleAuthor from 'base/ArticleAuthor';
import ArticleItem from 'base/ArticleItem';
import ArticleItemType from 'base/ArticleItemType';
import ArticleURL from 'base/ArticleURL';
import Parser from 'base/Parser';

import BaseParser from '../BaseParser';

import * as CheerioPlugin from '../util/CheerioPlugin';
import * as NodeReadPlugin from '../util/NodeReadPlugin';

import * as app from 'app/util/applib';

const log = app.createLog();

const elementTags = [
	'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'ul', 'img', 'ol', 'a',
];

export default class GenericParser extends BaseParser implements Parser {

	protected nodeRead : NodeReadPlugin.NodeReadArticle;
	protected select : Cheerio;

	// Initialize plugins

	protected initialize() : Promise <any> {
		return NodeReadPlugin.create(this.rawArticle)
			.then((a : NodeReadPlugin.NodeReadArticle) => this.nodeRead = a)
		// Executed sequentially because Cheerio receives NodeRead's parsed content
		.then(() => CheerioPlugin.create(this.nodeRead.content))
			.then((s : Cheerio) => this.select = s);
	}

	// Parser Implementation

	protected parseVersion() : Promise <string> {
		return Promise.resolve('');
	}

	protected parseByline() : Promise <ArticleAuthor[]> {
		return Promise.resolve([]);
	}

	protected parseTitles() : Promise <ArticleItem[]> {
		return Promise.resolve([
			this.createMainTitleEl(this.nodeRead.title),
		]);
	}

	protected parseFeaturedImage() : Promise <ArticleItem[]> {
		const meta = this.select('head').find('meta[property="og:image"]');
		const featured : ArticleItem[] = [];

		if (meta.length === 1) {
			featured.push(this.createFeaturedImageEl(meta.attr('content')));
		}

		return Promise.resolve(featured);
	}

	protected parseContent() : Promise <ArticleItem[]> {
		const items : ArticleItem[] = [];
		const $elements = this.select(elementTags.join(','));

		for (const index in $elements) {
			const el = $elements[index];

			if ((!el.hasOwnProperty('name')) || (!elementTags.includes(el.name))) {
				continue;
			}

			let item : ArticleItem;

			switch (el.name) {
				case 'h2':
				case 'h3':
				case 'h4':
				case 'h5':
				case 'h6':
					item = this.createSubHeadingEl(this.select(el).text());
					break;

				case 'img':
					item = this.createFigureEl(el.attribs.src, el.attribs.alt);
					break;

				case 'a':
					item = this.createLinkEl(el.attribs.href, this.select(el).text());
					break;

				case 'p':
				default:
					item = this.createParagraphEl(this.select(el).text());
					break;
			}

			if (item !== undefined) {
				items.push(item);
			}
		}

		return Promise.resolve(items);
	}

}
