import { BaseModel } from './base';

class Article extends BaseModel {
	private title: string;
	private elements: {type: string, data: string, order: number}[];
	private url: string;
	private modified_identifier: string;

	private required: string[] = [
		'title',
		'elements',
		'url',
		'modified_identifier'
	]

	constructor (properties: {}) {
		super();
		if (!this.validate(properties)) {
			console.error('Failed to validate article! Heres the props that failed: ', properties);
			// Throw some kind of article could not be created exception
		}
		this.title = properties['title'];
		this.elements = properties['elements'];
		this.url = properties['url'];
		this.modified_identifier = properties['modified_identifier'];
	}



	private validate (properties: Object) {
		// Loop through the required props array
		for (let index in this.required) {
			// Check for the required property
			if (!properties.hasOwnProperty(this.required[index])) {
				return false;
			}
		}
		// Validation succeeded
		return true;
	}
}

export { Article };
