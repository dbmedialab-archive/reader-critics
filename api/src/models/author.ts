import BaseModel from './base';

export default class Author extends BaseModel {
	private _name: string;
	private _email: string;

	constructor (properties: Object) {
		super(['name', 'email']);

		if (!this.validate(properties)) {
			console.error('Failed to validate author! Heres the props that failed: ', properties);
		}
		this._name = properties['name'];
		this._email = properties['email'];
	}

	public get name(): string {
		return this._name;
	}

	public set name(name: string) {
		this._name = name;
	}

	public get email(): string {
		return this._email;
	}

	public set email(email: string) {
		this._email = email;
	}
}
