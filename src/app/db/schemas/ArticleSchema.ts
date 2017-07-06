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

class ArticleDAO {

}

ArticleSchema.index({
	'url': 1,
	'version': 1,
}, {
	name: 'unique_article_version',
	unique: true,
});

ArticleSchema.loadClass(ArticleDAO);

export default ArticleSchema;
