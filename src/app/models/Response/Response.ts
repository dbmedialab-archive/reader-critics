export default class Response {
	private success: boolean;
	private message: string;

	constructor(success: boolean, message: string) {
		this.success = success;
		this.message = message;
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
