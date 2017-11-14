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
import Parser from 'base/Parser';

import AbstractParser from '../../AbstractParser';

import * as CheerioPlugin from '../../util/CheerioPlugin';
import * as NodeReadPlugin from '../../util/NodeReadPlugin';

import * as app from 'app/util/applib';

const log = app.createLog();

const elementTags = [
	'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'ul', 'img', 'ol', 'a',
];

export default class GenericParser extends AbstractParser implements Parser {

	protected nodeRead : NodeReadPlugin.NodeReadArticle;
	protected select : Cheerio;
	protected contentSelect : Cheerio;

	// Initialize plugins

	protected initialize() : Promise <any> {
		log('initialize');
		return NodeReadPlugin.create(this.rawArticle)
			.then((a : NodeReadPlugin.NodeReadArticle) => this.nodeRead = a)
		// Executed sequentially because Cheerio receives NodeRead's parsed content
		.then(() => CheerioPlugin.create(this.rawArticle))
			.then((s : Cheerio) => this.select = s)
		.then(() => CheerioPlugin.create(this.nodeRead.content))
			.then((s : Cheerio) => this.contentSelect = s);
	}

	// Parser Implementation

	protected parseVersion() : Promise <string> {
		log('parsing version');
		return Promise.resolve('');
	}

	protected parseByline() : Promise <ArticleAuthor[]> {
		log('parsing byline');
		return Promise.resolve([]);
	}

	protected parseTitles() : Promise <ArticleItem[]> {
		const title = this.nodeRead.title;
		log('parsing title:', title);
		return Promise.resolve([
			this.createMainTitleEl(title),
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
		const $elements = this.contentSelect(elementTags.join(','));

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
					item = this.createSubHeadingEl(this.contentSelect(el).text());
					break;

				case 'img':
					item = this.createFigureEl(el.attribs.src, el.attribs.alt);
					break;

				case 'a':
					item = this.createLinkEl(el.attribs.href, this.contentSelect(el).text());
					break;

				case 'p':
				default:
					item = this.createParagraphEl(this.contentSelect(el).text());
					break;
			}

			if (item !== undefined) {
				items.push(item);
			}
		}

		return Promise.resolve(items);
	}

}
