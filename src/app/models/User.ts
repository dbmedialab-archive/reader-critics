import BaseModel from './Base';
import * as bcrypt from 'bcrypt';

const rounds = 10;

export interface IUser {
	name: string;
	login: string;
	id: number;
	token?: string;
	setPassword: (password: string) => void;
	comparePassword: (password: string, cb: (isMatch: boolean) => void) => void;
	toString: () => any;
}

// TODO rewrite it on DB added
export default class User extends BaseModel implements IUser {
	public name: string;
	public login: string;
	private password: string;
	public id: number;

	constructor (properties : Object) {
		super(['name', 'login', 'password']);

		if (!this.validate(properties)) {
			console.error('Failed to validate user! Heres the props that failed: ', properties);
		}
		this.id = 0;
		this.name = properties['name'];
		this.login = properties['login'];
		this.setPassword(properties['password']);
	}

	public setPassword(password: string) {
		bcrypt.genSalt(rounds, function(saltErr, salt) {
			bcrypt.hash(password, salt, function(hashErr, hash) {
				this.password = hash;
			});
		});
	}

	public comparePassword(password: string, cb: (isMatch: boolean) => void): void {
		bcrypt.compare(password, this.password, cb);
	}

	public toString() {
		const obj = Object.assign({}, super.toString());
		delete obj['failedProperties'];
		return obj;
	}
}
