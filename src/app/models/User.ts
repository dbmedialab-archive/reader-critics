import * as bcrypt from 'bcrypt';

const rounds = 10;

export interface IUser {
	name: string;
	login: string;
	id: number;
	token?: string;
	setPassword: (password: string) => void;
	comparePassword: (password: string, cb: (err: string, isMatch: boolean) => void) => void;
	toString: () => any;
}

// TODO rewrite it on DB added
export default class User implements IUser {
	public name: string;
	public login: string;
	private password: string;
	public id: number;

	constructor(properties: Object) {
		this.id = 0;
		this.name = properties['name'];
		this.login = properties['login'];
		this.setPassword(properties['password']);
	}

	public setPassword(password: string) {
		// TODO replace with async in DB before-save hook
		this.password = bcrypt.hashSync(password, rounds);
	}

	public comparePassword(password: string, cb: (err: string, isMatch: boolean) => void): void {
		bcrypt.compare(password, this.password, cb);
	}

	public toString() {
		const obj = Object.assign({}, this);
		delete obj['password'];
		return obj;
	}
}
