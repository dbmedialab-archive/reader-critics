import { MongoError } from 'mongodb';

export const isDuplicateError = (err : Error) : boolean => (
	err instanceof MongoError && err.code === 11000
);

export class DuplicateError extends Error {

	constructor(err : MongoError) {
		super(err.message.replace(/^.*key error index:/, '').trim());
		Object.setPrototypeOf(this, DuplicateError.prototype);
		this.name = 'DuplicateError';
	}

}
