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

import Article from 'base/Article';
import ArticleURL from 'base/ArticleURL';
import ParserFactory from 'base/ParserFactory';
import Website from 'base/Website';

import {
	articleService,
	parserService,
} from 'app/services';

import emptyCheck from 'app/util/emptyCheck';

/**
 * @param website Needed to determine the parser for this article
 * @param url The source of the article
 */
export default function(website : Website, url : ArticleURL) : Promise <Article> {
	emptyCheck(website, url);

	let parserFactory : ParserFactory;
	let rawArticle : string;
	let downloadURL = url;

	const parserPromise = parserService.getParserFor(website)
		.then((fact : ParserFactory) => parserFactory = fact);

	// temporary solution
	if (website.parserClass == 'LabradorParser') {
		downloadURL = getLarbradorUrl(url);
	}
	const fetchPromise = articleService.download(downloadURL)
		.then((data : string) => {
			rawArticle = data;
		});

	return Promise.all([parserPromise, fetchPromise])
	.then(() => parserFactory.newInstance(rawArticle, url).parse());
}

function getLarbradorUrl(url: ArticleURL) {
	let parts = url.href.split('/');
	const articleID = parts[parts.length - 1];
	const labUrl = `https://labrador.dagbladet.no/api/v1/article/${articleID}.json?content=full`;
	//@TODO -  this hack should be deleted as well, with proper downloadURL solution
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	
	return new ArticleURL(labUrl);
}
