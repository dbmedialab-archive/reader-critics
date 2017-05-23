import {
	default as axios,
	AxiosPromise,
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
