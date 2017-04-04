import Response from './Response';

export default class ErrorRespnse extends Response {
	private errors: object;

	constructor(success: boolean, message: string, errors: object) {
		super(success, message);
		this.errors = errors;
	}

	public getErrors(): object {
		return this.errors;
	}

	public setErrors(errors: object) {
		this.errors = errors;
	}
}
