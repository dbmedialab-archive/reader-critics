import { Schema } from 'mongoose';
import * as app from 'app/util/applib';

export default function(schema : Schema, options : any) {
	schema.add({
		date: {
			created: Date,
			modified: Date,
		},
	});

	schema.index({ 'date.created': -1 }, { name: 'date_created' });

	schema.pre('save', function (next) {
		if (this.date.created === undefined) {
			this.date.created = new Date();
		}
		next();
	});

}
