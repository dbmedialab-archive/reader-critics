import * as Promise from 'bluebird';

import * as app from 'app/util/applib';

import ArticleURL from 'app/base/ArticleURL';

const log = app.createLog();

export function getArticle(url : ArticleURL) : Promise <any> {
	// TODO serve different mock files based on "url" parameter
	const p = 'resources/article/article-get-01.json';
	log('Loading from', p);
	return app.loadJSON(p);
}
