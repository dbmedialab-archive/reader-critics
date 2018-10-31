//
// LESERKRITIKK v2 (aka Reader Critics)
// Copyright (C) 2017 DB Medialab/Aller Media AS, Oslo, Norway
// https://github.com/dbmedialab/reader-critics/
//
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with
// this program. If not, see <http://www.gnu.org/licenses/>.
//

import { Schema } from 'mongoose';
import { ArticleURL } from 'base/ArticleURL';
import { objectReference } from 'app/db/common';
import { ModelNames } from 'app/db/names';

const ArticleSchema : Schema = new Schema({
	url: {
		type: String,
		required: true,
		set: (url : string|ArticleURL) : string => url instanceof ArticleURL ? url.href : url,
	},
	version: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		//required: true,
	},
	items: [Schema.Types.Mixed],

	authors: [objectReference(ModelNames.User)],
	website: objectReference(ModelNames.Website),

	// Point references to all feedbacks of this article,
	// makes counting them a lot easier!
	feedbacks: [objectReference(ModelNames.Feedback)],

	status: {
		escalated: {
			type: String,
			// required: true,
			// enum: Object.values(EscalationLevel),
			default: null,
		},
	},

	newerVersion: objectReference(ModelNames.Article, {
		required: false,
		select: false,
	}),
}, {
	toObject: {
		retainKeyOrder: true,
		transform: (doc : Document, converted : any) => {
			converted.authors.forEach(author => {
				delete author.date;
				delete author.role;
			});
			return converted;
		},
	},
});

ArticleSchema.index({
	'url': 1,
	'version': 1,
}, {
	name: 'unique_article_version',
	unique: true,
});

export default ArticleSchema;
