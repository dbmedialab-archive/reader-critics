import { Parser } from './index';
import { Article } from '../models/article';

class BaseParser implements Parser {
	readonly elementTags = ['p','h1','h2','h3','h4','h5','ul','img','ol'];
	readonly url: string;
	private article: Article;

	constructor (url: string) {
		this.url = url;
	}

	getArticle() {
		return this.article;
	}
}

export { BaseParser };
