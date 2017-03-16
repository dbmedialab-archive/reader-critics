import Author from './author';
import BaseModel from './base';

export default class Byline extends BaseModel {
	private authors: Author[];

	constructor (properties: Object) {
		super(['authors']);

		if (!this.validate(properties)) {
			console.error('Failed to validate byline. Heres the props that failed: ', properties);
		}

		this.authors = properties['authors'];
	}
}
