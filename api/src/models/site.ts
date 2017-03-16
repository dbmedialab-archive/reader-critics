import BaseModel from './base';

export default class Site extends BaseModel {
	private _name: string;

	constructor (properties: Object) {
		super(['name']);

		if (!this.validate(properties)) {
			console.error('Failed to validate site! Heres the props that failed: ', properties);
		}
		this._name = properties['name'];
	}

	public get name(): string {
		return this._name;
	}

	public set name(name: string) {
		this._name = name;
	}
}
