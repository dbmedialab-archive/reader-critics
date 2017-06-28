import Article from 'base/Article';
import ArticleAuthor from 'base/ArticleAuthor';
import ArticleItem from 'base/ArticleItem';
import ArticleURL from 'base/ArticleURL';
import Parser from 'base/Parser';

abstract class BaseParser implements Parser {

	parse(rawHTML : string, url : ArticleURL) : Promise <Article> {
		const version : string = this.parseVersion();
		const authors : ArticleAuthor[] = this.parseByline();

		const items : ArticleItem[] = [
			...this.parseTitles(),
			...this.parseContent(),
		];

		const parsedArticle : Article = {
			url,
			version,
			authors,
			items,
		};

		return Promise.resolve(parsedArticle);
	}

	// Prototypes

	protected abstract parseVersion() : string;

	protected abstract parseByline() : ArticleAuthor[];

	protected abstract parseTitles() : ArticleItem[];

	protected abstract parseContent() : ArticleItem[];

}

export default BaseParser;

/*
import {
	AxiosPromise,
	default as axios,
} from 'axios';

import * as Promise from 'bluebird';

import Article from '../models/Article';
import Parser from './Parser';

export default class BaseParser implements Parser {

	readonly url: string;
	readonly elementTags = ['p','h1','h2','h3','h4','h5','ul','img','ol', 'a'];
	protected requestSent: boolean;
	protected article: Article;

	constructor (url: string) {
		this.url = url;
		this.requestSent = false;
	}

	getArticle(): Promise <Article> {
		return Promise.resolve(this.article);
	}

	// Requests the url
	protected request() : AxiosPromise {
		this.requestSent = true;
		return axios.get(this.url);
	}

}
*/
