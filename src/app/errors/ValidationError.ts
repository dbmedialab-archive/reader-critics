export default class ValidationError extends Error {
	readonly name: string = 'ValidationError';
	readonly message: string = 'Failed to validate model';
	readonly model: string;
	readonly properties: string[];

	constructor (model: string, properties: string[]) {
		super();
		this.model = model;
		this.properties = properties;
	}
}
