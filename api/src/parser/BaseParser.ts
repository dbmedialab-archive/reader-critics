import axios from 'axios';
import Article from '../models/article';
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

	getArticle(): Article {
		return this.article;
	}

	// Requests the url
	protected request() {
		this.requestSent = true;
		return axios.get(this.url).then(response => {
			return Promise.resolve(response);
		}).catch(error => {
			return Promise.reject(error);
		});
	}
}
