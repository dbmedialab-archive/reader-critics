export class EmptyError extends Error {

	constructor(message : string) {
		super(message);
		Object.setPrototypeOf(this, EmptyError.prototype);
	}

}
