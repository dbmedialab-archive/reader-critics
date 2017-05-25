import BaseModel from './Base';
import Byline from './Byline';
import Tag from './Tag';

// import ValidationError from '../errors/ValidationError';

export default class Article extends BaseModel {
	private byline: Byline;
	private tags: Tag[];
	private title: string;
	private elements: { type : string, data : string, order : number }[];
	private url: string;
	private modifiedIdentifier: string;

	constructor (properties: Object) {
		super(['title','elements','url','modifiedIdentifier']);

		/*if (!super.validate(properties)) {
			throw new ValidationError('Article', this.failedProperties);
		}*/
		this.title = properties['title'];
		this.elements = properties['elements'];
		this.url = properties['url'];
		this.modifiedIdentifier = properties['modifiedIdentifier'];
		this.tags = [];

	}

	public getArticle(): Object {
		return {
			modifiedIdentifier: this.modifiedIdentifier,
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

	/**
	 * OBS! If the receiver intends to change/iterate the returned array, it must clone it!
	 */
	public getRawElements() : { type : string, data : string, order : number }[] {
		return this.elements;
	}

}
