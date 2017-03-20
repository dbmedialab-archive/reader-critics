import BaseModel from './base';
import Byline from './byline';
import Tag from './tag';

export default class Article extends BaseModel {
	private byline: Byline;
	private tags: Tag[];
	private title: string;
	private elements: {type: string, data: string, order: number}[];
	private url: string;
	private modified_identifier: string;

	constructor (properties: Object) {
		super(['title','elements','url','modified_identifier',]);

		if (!super.validate(properties)) {
			console.error('Failed to validate article! Heres the props that failed: ', properties);
			// Throw some kind of article could not be created exception
		}
		this.title = properties['title'];
		this.elements = properties['elements'];
		this.url = properties['url'];
		this.modified_identifier = properties['modified_identifier'];
		this.tags = [];

	}

	public getArticle(): Object {
		return {
			modified_identifier: this.modified_identifier,
			url: this.url,
			title: this.title,
			byline: this.byline,
			elements: this.elements,
			tags: this.tags,
		};
	}

	public getByline(): Byline {
		return this.byline;
	}

	public setByline(byline: Byline) {
		this.byline = byline;
	}

	public getTags(): Tag[] {
		return this.tags;
	}

	public setTags(tags: Tag[]) {
		this.tags = tags;
	}

	public attachTag(tag: Tag) {
		this.tags.push(tag);
	}
}
