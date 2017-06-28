import * as Cheerio from 'cheerio';

import ArticleAuthor from 'base/ArticleAuthor';

/**
 * Facebook's OpenGraph scheme
 * looks for <meta property="article:modified_time" content="...">
 * and <meta property="article:bylineEmail" content="...">
 */
export function getOpenGraphAuthors(select : Cheerio) : ArticleAuthor[] {
	const metaName = select('head').find('meta[property="article:byline"]');
	const metaMail = select('head').find('meta[property="article:bylineEmail"]');

	if (metaName.length < 1 && metaMail.length < 1) {
		return [];
	}

	const splitName = metaName.attr('content').split(',');
	const splitMail = metaMail.attr('content').split(',');

	if (splitName.length !== splitMail.length) {
		return [];
	}

	return splitName.map((name : string, index : number) => ({
		name: name.trim(),
		email: splitMail[index].trim(),
	}));
}
