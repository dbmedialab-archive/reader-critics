import * as Cheerio from 'cheerio';

import ArticleAuthor from 'base/ArticleAuthor';

/**
 * Facebook's OpenGraph scheme
 * looks for <meta property="article:modified_time" content="...">
 * and <meta property="article:bylineEmail" content="...">
 */
export function getOpenGraphAuthors(select : Cheerio) : ArticleAuthor[] {
	return [];
}
