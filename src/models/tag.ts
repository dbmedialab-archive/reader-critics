import BaseModel from './base';

export default class Tag extends BaseModel {
	private tag: string;

	constructor (properties: string) {
		super();
		// TODO: Handle some kinda validation to make sure that a string is passed
		this.tag = properties;
	}

	public getTag(): string {
		return this.tag;
	}

	public setTag(tag: string) {
		this.tag = tag;
	}
}
