export default class BaseModel {
	protected id: number;
	protected created_at: string;
	protected updated_at: string;
	private required: string[];

	constructor(required?: string[]) {
		if (typeof required === 'undefined') {
			required = [];
		}
		this.required = required;
	}

	protected validate(properties: Object) {
		// Loop through the required props array
		for (const index in this.required) {
			// Check for the required property
			if (!properties.hasOwnProperty(this.required[index])) {
				return false;
			}
		}
		// Validation succeeded
		return true;
	}

	public toString() {
		console.log('before', this);
		const obj = Object.assign({}, this);
		delete obj['required'];
		console.log('after', this);
		return obj;
	}
}
