import * as Promise from 'bluebird';

import ArticleURL from 'app/base/ArticleURL';

export function getArticle(url : ArticleURL) : Promise <any> {
	return Promise.resolve({ article: 'empty' });
}
