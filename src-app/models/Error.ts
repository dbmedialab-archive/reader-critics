export default class Error {
	private success: boolean;
	private message: string;
	private errors: object;

	constructor(success: boolean, message: string, errors?: object) {
		this.success = success;
		this.message = message;
		this.errors = errors;
	}

	public getSuccess(): boolean {
		return this.success;
	}

	public setSuccess(success: boolean) {
		this.success = success;
	}

	public getMessage(): string {
		return this.message;
	}

	public setMessage(message: string) {
		this.message = message;
	}
}
