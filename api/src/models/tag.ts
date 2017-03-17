import BaseModel from './base';

export default class Tag extends BaseModel {
	private _tag: string;

	constructor (properties: string) {
		super();
		// TODO: Handle some kinda validation to make sure that a string is passed
		this._tag = properties;
	}

	public get tag(): string {
		return this._tag;
	}

	public set tag(tag: string) {
		this._tag = tag;
	}
}
