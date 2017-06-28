import {
	AxiosPromise,
	AxiosResponse,
	default as axios,
} from 'axios';

import Article from 'base/Article';
import ArticleURL from 'base/ArticleURL';
import Parser from 'base/Parser';
import Website from 'base/Website';

import { parserService } from 'app/services';

import * as app from 'app/util/applib';

const log = app.createLog();

/**
 * @param website Needed to determine the parser for this article
 * @param url The source of the article
 */
export default function(website : Website, url : ArticleURL) : Promise <Article> {
	let siteParser : Parser;
	let rawArticle : string;

	const parserPromise = parserService.getParserFor(website)
		.then((p : Parser) => siteParser = p);

	const fetchPromise = axios.get(url.href)
		.then((resp : AxiosResponse) => rawArticle = resp.data);

	return Promise.all([parserPromise, fetchPromise])
	.then(() => {
		log('### after Promise.all');
		log('raw:', rawArticle.substring(0, 300));
		log('parser:', siteParser.parse);
	})
	.then(() => siteParser.parse(rawArticle, url));
}
