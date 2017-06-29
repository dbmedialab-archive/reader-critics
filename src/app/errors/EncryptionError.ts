import * as app from 'app/util/applib';
const log = app.createLog();

export default class EncryptingError extends Error {
	readonly name: string = 'EncryptingError';
	readonly message: string = 'Failed to encrypt data in model';
	readonly model: string;
	readonly properties: string[];

	constructor (model: string, properties: string[]) {
		super();
		this.model = model;
		this.properties = properties;
		log(properties);
	}
}
