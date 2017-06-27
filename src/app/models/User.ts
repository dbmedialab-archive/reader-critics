import BaseModel from './Base';
import bcrypt from 'bcrypt';
import EncryptionError from '../errors/EncryptionError';

const rounds = 10;

export default class User extends BaseModel {
	private name: string;
	private login: string;
	private password: string;

	constructor (properties: Object) {
		super(['name', 'email', 'password']);

		if (!this.validate(properties)) {
			console.error('Failed to validate user! Heres the props that failed: ', properties);
		}
		this.name = properties['name'];
		this.login = properties['login'];
		this.setPassword(properties['password']);
	}

	public getName(): string {
		return this.name;
	}

	public setName(name: string) {
		this.name = name;
	}

	public getLogin(): string {
		return this.login;
	}

	public setLogin(email: string) {
		this.login = email;
	}

	public setPassword(password: string) {
		bcrypt.hash(password, rounds, function(err, hash) {
			this.password = hash;
		});
	}

	public checkPassword(password: string, cb: () => boolean): boolean {
		return bcrypt.compare(password, this.password).then(cb);
	}
}
