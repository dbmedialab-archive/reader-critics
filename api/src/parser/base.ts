import Article from '../models/article';
import { Parser } from './index';

class BaseParser implements Parser {
	readonly elementTags = ['p','h1','h2','h3','h4','h5','ul','img','ol', 'a'];
	readonly url: string;
	protected article: Article;

	constructor (url: string) {
		this.url = url;
	}

	getArticle(): Article {
		return this.article;
	}
}

export { BaseParser };
