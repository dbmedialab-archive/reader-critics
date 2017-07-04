import * as Cheerio from 'cheerio';

export function create(rawArticle : string) : Promise <Cheerio> {
	return Promise.resolve(Cheerio.load(rawArticle));
}
