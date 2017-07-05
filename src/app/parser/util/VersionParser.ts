import * as Cheerio from 'cheerio';

/**
 * Facebook's OpenGraph scheme
 * looks for <meta property="article:modified_time" content="...">
 */
export function getOpenGraphModifiedTime(select : Cheerio) : string {
	const meta = select('head').find('meta[property="article:modified_time"]');
	return meta.length < 1 ? undefined : meta.attr('content');
}
