import Author from './author';
import BaseModel from './base';

export default class Byline extends BaseModel {
	private authors: Author[];

	constructor (properties: Object) {
		super([]);

		if (!this.validate(properties)) {
			console.error('Failed to validate byline. Heres the props that failed: ', properties);
		}

		this.authors = [];
	}

	public getAuthors(): Author[] {
		return this.authors;
	}

	public setAuthors(authors: Author[]) {
		this.authors = authors;
	}

	public attachdAuthor(author: Author) {
		this.authors.push(author);
	}
}
