import BaseModel from './Base';

export default class Site extends BaseModel {
	private name: string;

	constructor (properties: Object) {
		super(['name']);

		if (!this.validate(properties)) {
			console.error('Failed to validate site! Heres the props that failed: ', properties);
		}
		this.name = properties['name'];
	}

	public getName(): string {
		return this.name;
	}

	public setName(name: string) {
		this.name = name;
	}
}
