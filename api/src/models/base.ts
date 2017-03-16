export default class BaseModel {
	protected id: number;
	protected created_at: string;
	protected updated_at: string;
	protected required: string[];

	constructor(required: string[]) {
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
}
