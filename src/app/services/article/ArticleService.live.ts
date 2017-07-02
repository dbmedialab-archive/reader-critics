export { default as download } from './live/download';
export { default as fetch } from './common/fetch';

export { default as load } from './live/load';
export { default as save } from './live/save';

/*
import * as Promise from 'bluebird';

import * as app from 'app/util/applib';

import Article from 'base/Article';
import ArticleItem from 'base/ArticleItem';
import ArticleItemType from 'base/ArticleItemType';
import ArticleURL from 'base/ArticleURL';

import ArticleModel from 'app/models/Article';
import HtmlParser from 'app/parser/html/HtmlParser';

const log = app.createLog();

declare interface IntermediateElem {
	type : string;
	data : any;
	order : number;
}

// TODO:
// - check article version against database
// - decide wether to load newest version or use available data (no newer version found)
// - load article+version (both necessary for unique reference) from database

export function getArticle(url : ArticleURL, version : string) : Promise <Article> {
	return new HtmlParser(url.href)
		.getArticle()
		.then(createExportableStruct)
		.then((items : ArticleItem[]) => <Article> ({
			url,
			version,
			items,
		}));
}

function createExportableStruct(article : ArticleModel) : Promise <ArticleItem[]> {
	const rawElements : IntermediateElem[] = Array.from(article.getRawElements());
	const newElements : any[] = [];

	let elemOrder : number = 1;
	const typeOrder = {};

	Object.keys(ArticleItemType).forEach(name => (typeOrder[name] = 1));

	log(typeOrder);

	while (rawElements.length > 0) {
		const next : IntermediateElem = rawElements.shift();
		log('%o', next);

		const type : ArticleItemType = mapElementType(next);

		log('type [%s] typeOrder [%d]', type, typeOrder[type]);

		const newElem : any = {
			type,
			order: {
				elem: elemOrder,
				type: typeOrder[type],
			},
		};

		if (newElem.type === 'figure') {
			newElem.image = {
				url: next.data.src,
			};

			// That is a very rudimentary image caption detection, which often yields "false positives"
			/* if (rawElements.length > 0 && rawElements[0].type === 'p') {
				const captElem : IntermediateElem = rawElements.shift();
				newElem.image.caption = captElem.data.text;
			} * /
			// TODO integrate caption recognition into initial parser

			newElements.push(newElem);

			elemOrder ++;
			typeOrder[type] ++;
		}
		else if (newElem.type !== null) {
			if (next.data.text.length > 0) {
				newElem.text = next.data.text;
				newElements.push(newElem);

				elemOrder ++;
				typeOrder[type] ++;
			}
			else {
				log('Skipped empty content');
			}
		}
	}

	return Promise.resolve(newElements);
}

function mapElementType(elem : IntermediateElem) : ArticleItemType {
	if (isMainTitle(elem)) {
		return ArticleItemType.MainTitle;
	}

	if (isSubHeading(elem)) {
		return ArticleItemType.SubHeading;
	}

	if (isFigure(elem)) {
		return ArticleItemType.Figure;
	}

	if (isParagraph(elem)) {
		return ArticleItemType.Paragraph;
	}

	// TODO add missing types from enum

	return null;
}

function isMainTitle(elem : IntermediateElem) : boolean {
	return elem.type === 'h1';
}

const rxSubHeading = /(:?h2|h3|h4|h5|h6)/;

function isSubHeading(elem : IntermediateElem) : boolean {
	return rxSubHeading.test(elem.type);
}

function isFigure(elem : IntermediateElem) : boolean {
	return elem.type === 'img';
}

function isParagraph(elem : IntermediateElem) : boolean {
	return elem.type === 'p';
}
*/
