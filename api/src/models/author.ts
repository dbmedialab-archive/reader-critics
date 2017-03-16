export default class Author {
	private _name: string;
	private _email: string;

	constructor (name: string, email: string) {
		this._name = name;
		this._email = email;
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
