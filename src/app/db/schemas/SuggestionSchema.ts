import { Schema } from 'mongoose';

const SuggestionSchema : Schema = new Schema({
	email: String,
	comment: String,

	remote: {
		ipAddress: String,
		userAgent: String,
	},
});

export default SuggestionSchema;
