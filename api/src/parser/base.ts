import { Parser } from './index';
import { Article } from '../models/article';

class BaseParser implements Parser {
	readonly url: string;
	private article: Article;

	constructor (url: string) {
		this.url = url;
	}
}

export { BaseParser };
