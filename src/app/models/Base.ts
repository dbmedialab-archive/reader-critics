export default class BaseModel {
	protected id: number;
	protected createdAt: string;
	protected updatedAt: string;
	protected failedProperties: string[];
	private required: string[];

	constructor(required?: string[]) {
		if (typeof required === 'undefined') {
			required = [];
		}
		this.required = required;
	}

	protected validate(properties: Object) {
		let valid = true;
		this.failedProperties = [];
		// Loop through the required props array
		for (const index in this.required) {
			// Check for the required property
			if (!properties.hasOwnProperty(this.required[index])) {
				this.failedProperties.push(this.required[index]);
				valid = false;
			}
		}
		return valid;
	}

	public toString() {
		const obj = Object.assign({}, this);
		delete obj['required'];
		return obj;
	}
}
