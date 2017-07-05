export class EmptyError extends Error {

	constructor(message : string) {
		super(message);
		Object.setPrototypeOf(this, EmptyError.prototype);
	}

}

export class NotFoundError extends Error {

	constructor(message : string) {
		super(message);
		Object.setPrototypeOf(this, NotFoundError.prototype);
	}

}

export class ParserNotFoundError extends NotFoundError {

	constructor(message : string) {
		super(message);
		Object.setPrototypeOf(this, ParserNotFoundError.prototype);
	}

}
