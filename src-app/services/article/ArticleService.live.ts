import * as Promise from 'bluebird';

import * as app from 'app/util/applib';

import Article from 'app/models/Article';
import ArticleURL from 'app/base/ArticleURL';
import ArticleElementType from 'app/base/ArticleElementType';
import HtmlParser from 'app/parser/html/HtmlParser';

const log = app.createLog();

// TODO:
// - check article version against database
// - decide wether to load newest version or use available data (no newer version found)
// - load article+version (both necessary for unique reference) from database

export function getArticle(url : ArticleURL) : Promise <any> {
	return new HtmlParser(url.href).getArticle().then(createExportableStruct);
}

function createExportableStruct(article : Article) : Promise <any> {
	const rawElements = Array.from(article.getRawElements());
	const newElements : any[] = [];

	while (rawElements.length > 0) {
		const next : any = rawElements.shift();
		log('%o', next);

		newElements.push({
			type: getElementType(next.type),
			order: next.order,
			text: next.data.text,
		});
	}

	return Promise.resolve(newElements);
}

function getElementType(origType : string) : string {
	return ArticleElementType[mapElementType(origType)];
}

function mapElementType(origType : string) : ArticleElementType {
	if (origType === 'h1') {
		return ArticleElementType.title;
	}

	if ([ 'h2', 'h3', 'h4', 'h5', 'h6'].indexOf(origType) >= 0) {
		return ArticleElementType.subtitle;
	}

	return ArticleElementType.paragraph;
}
