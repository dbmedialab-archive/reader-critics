import * as Promise from 'bluebird';

import * as app from 'app/util/applib';

import Article from 'base/Article';
import ArticleURL from 'base/ArticleURL';

const log = app.createLog();

export function getArticle(url : ArticleURL) : Promise <Article> {
	// TODO serve different mock files based on "url" parameter
	const p = 'resources/article/article-get-01.json';
	log('Loading from', p);
	return <Promise <Article>> app.loadJSON(p);
}
