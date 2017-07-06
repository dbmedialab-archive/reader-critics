import { Schema } from 'mongoose';

export default function(schema : Schema, options : any) {
	schema.add({
		date: {
			created: Date,
			modified: Date,
		},
	});

	schema.pre('save', function (next) {
		this.date.created = new Date();
		next();
	});

	if (options && options.index) {
		schema.path('date.created').index(options.index);
		schema.path('date.modified').index(options.index);
	}
}
