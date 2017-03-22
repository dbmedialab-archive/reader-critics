import BaseModel from './base';

export default class Author extends BaseModel {
	private name: string;
	private email: string;

	constructor (properties: Object) {
		super(['name', 'email']);

		if (!this.validate(properties)) {
			console.error('Failed to validate author! Heres the props that failed: ', properties);
		}
		this.name = properties['name'];
		this.email = properties['email'];
	}

	public getName(): string {
		return this.name;
	}

	public setName(name: string) {
		this.name = name;
	}

	public getEmail(): string {
		return this.email;
	}

	public setEmail(email: string) {
		this.email = email;
	}
}
