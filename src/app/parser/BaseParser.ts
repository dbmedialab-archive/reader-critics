import Article from 'base/Article';
import ArticleAuthor from 'base/ArticleAuthor';
import ArticleItem from 'base/ArticleItem';
import ArticleURL from 'base/ArticleURL';
import Parser from 'base/Parser';

abstract class BaseParser implements Parser {

	parse(rawHTML : string, url : ArticleURL) : Promise <Article> {
		let version : string;
		let authors : ArticleAuthor[];
		let titles : ArticleItem[];
		let content : ArticleItem[];

		// Create parser promises
		const pVersion = this.parseVersion()
			.then((v : string) => version = v);

		const pAuthors = this.parseByline()
			.then((a : ArticleAuthor[]) => authors = a);

		const pTitles = this.parseTitles()
			.then((t : ArticleItem[]) => titles = t);

		const pContent = this.parseContent()
			.then((c : ArticleItem[]) => content = c);

		// Execute all promises and assemble an article object
		return Promise.all([
			pVersion,
			pAuthors,
			pTitles,
			pContent,
		]).then(() : Article => ({
			url,
			version,
			authors,
			items: [
				...titles,
				...content,
			],
		}));
	}

	// Prototypes

	protected abstract parseVersion() : Promise <string>;

	protected abstract parseByline() : Promise <ArticleAuthor[]>;

	protected abstract parseTitles() : Promise <ArticleItem[]>;

	protected abstract parseContent() : Promise <ArticleItem[]>;

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
