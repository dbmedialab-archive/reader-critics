import * as Cheerio from 'cheerio';

import Article from 'base/Article';
import ArticleAuthor from 'base/ArticleAuthor';
import ArticleItem from 'base/ArticleItem';
import ArticleURL from 'base/ArticleURL';
import Parser from 'base/Parser';

import BaseParser from '../BaseParser';

export default class GenericParser extends BaseParser implements Parser {

	protected select : Cheerio;

	parse(rawHTML : string, url : ArticleURL) : Promise <Article> {
		this.select = Cheerio.load(rawHTML);
		return super.parse(rawHTML, url);
	}

	protected parseVersion() : string {
		return 'narf';
	}

	protected parseByline() : ArticleAuthor[] {
		return [];
	}

	protected parseTitles() : ArticleItem[] {
		return [];
	}

	protected parseContent() : ArticleItem[] {
		return [];
	}

}
