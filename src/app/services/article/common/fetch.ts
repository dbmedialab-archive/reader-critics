import {
	AxiosPromise,
	AxiosResponse,
	default as axios,
} from 'axios';

import Article from 'base/Article';
import ArticleURL from 'base/ArticleURL';
import Parser from 'base/Parser';
import ParserFactory from 'base/ParserFactory';
import Website from 'base/Website';

import {
	articleService,
	parserService,
} from 'app/services';

import * as app from 'app/util/applib';

const log = app.createLog();

/**
 * @param website Needed to determine the parser for this article
 * @param url The source of the article
 */
export default function(website : Website, url : ArticleURL) : Promise <Article> {
	let parserFactory : ParserFactory;
	let rawArticle : string;

	const parserPromise = parserService.getParserFor(website)
		.then((fact : ParserFactory) => parserFactory = fact);

	const fetchPromise = articleService.download(url)
		.then((data : string) => {
			rawArticle = data;
		});

	return Promise.all([parserPromise, fetchPromise])
	.then(() => parserFactory.newInstance(rawArticle, url).parse());
}
