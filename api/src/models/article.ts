import BaseModel from './base';

export default class Article extends BaseModel {
	private title: string;
	private elements: {type: string, data: string, order: number}[];
	private url: string;
	private modified_identifier: string;

	constructor (properties: Object) {
		super(['title','elements','url','modified_identifier',]);

		if (!super.validate(properties)) {
			console.error('Failed to validate article! Heres the props that failed: ', properties);
			// Throw some kind of article could not be created exception
			return;
		}
		this.title = properties['title'];
		this.elements = properties['elements'];
		this.url = properties['url'];
		this.modified_identifier = properties['modified_identifier'];
	}
}
