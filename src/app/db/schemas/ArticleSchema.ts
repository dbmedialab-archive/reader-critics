import { Schema } from 'mongoose';

import ArticleURL from 'base/';

const ArticleSchema : Schema = new Schema({
	url: {
		type: String,
		set: (url : ArticleURL) : string => {
			console.log('schema set:', url);
			return url.href;
		},
	},
	version: String,

	items: [Schema.Types.Mixed],
});

class ArticleSchemaDecorator {
	// This is a template I shall try out:
	// http://mongoosejs.com/docs/advanced_schemas.html
}

ArticleSchema.index({
	'url': 1,
	'version': 1,
}, {
	name: 'unique_article_version',
	unique: true,
});

ArticleSchema.loadClass(ArticleSchemaDecorator);

export default ArticleSchema;
