import * as Cheerio from 'cheerio';
import * as NodeRead from 'node-read';

import Article from 'base/Article';
import ArticleAuthor from 'base/ArticleAuthor';
import ArticleItem from 'base/ArticleItem';
import ArticleItemType from 'base/ArticleItemType';
import ArticleURL from 'base/ArticleURL';
import Parser from 'base/Parser';

import BaseParser from '../BaseParser';

import * as app from 'app/util/applib';

const log = app.createLog();

export default class GenericParser extends BaseParser implements Parser {

	protected rawHTML : string;

	protected select : Cheerio;

	protected readArticle : any;

	parse(rawHTML : string, url : ArticleURL) : Promise <Article> {
		this.rawHTML = rawHTML;
		this.select = Cheerio.load(rawHTML);
		return super.parse(rawHTML, url);
	}

	protected parseVersion() : Promise <string> {
		return Promise.resolve('');
	}

	protected parseByline() : Promise <ArticleAuthor[]> {
		return Promise.resolve([]);
	}

	protected parseTitles() : Promise <ArticleItem[]> {
		return this.nodeRead().then((parsedArticle) => {
			return [{
				type: ArticleItemType.MainTitle,
				order: {
					item: 1,
					type: 1,
				},
				text: parsedArticle.title,
			}];
		});
	}

	protected parseContent() : Promise <ArticleItem[]> {
		return Promise.resolve([]);  // TODO copy over basic parser with node-read
	}

	protected nodeRead() : Promise <any> {
		if (this.readArticle !== undefined) {
			return Promise.resolve(this.readArticle);
		}

		return new Promise((resolve, reject) => {
			NodeRead(this.rawHTML, (err, article) => {
				if (err) {
					return reject(err);
				}

				log(article);
				return resolve(article);
			});
		});
	}

}
