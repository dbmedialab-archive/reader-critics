import * as Promise from 'bluebird';

import * as app from 'app/util/applib';

import Article from 'app/models/Article';
import ArticleURL from 'base/ArticleURL';
import ArticleElementType from 'base/ArticleElementType';
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

export function getArticle(url : ArticleURL) : Promise <any> {
	return new HtmlParser(url.href).getArticle().then(createExportableStruct);
}

function createExportableStruct(article : Article) : Promise <any> {
	const rawElements : IntermediateElem[] = Array.from(article.getRawElements());
	const newElements : any[] = [];

	let elemOrder : number = 1;
	let typeOrder = {};

	ArticleElementType.names.forEach(name => (typeOrder[name] = 1));

	log(typeOrder);

	while (rawElements.length > 0) {
		const next : IntermediateElem = rawElements.shift();
		log('%o', next);

		const type = mapElementType(next);

		log('type [%s] typeOrder [%d]', type, typeOrder[type]);

		const newElem : any = {
			type,
			order: {
				elem: elemOrder,
				type: typeOrder[type],
			}
		};

		if (newElem.type === 'figure') {
			newElem.image = {
				url: next.data.src,
			};

			// That is a very rudimentary image caption detection, which often yields "false positives"
			/* if (rawElements.length > 0 && rawElements[0].type === 'p') {
				const captElem : IntermediateElem = rawElements.shift();
				newElem.image.caption = captElem.data.text;
			} */
			// TODO integrate caption recognition into initial parser

			newElements.push(newElem);

			elemOrder ++;
			typeOrder[type] ++
		}
		else if (newElem.type !== null) {
			if (next.data.text.length > 0) {
				newElem.text = next.data.text;
				newElements.push(newElem);

				elemOrder ++;
				typeOrder[type] ++
			}
			else {
				log('Skipped empty content');
			}
		}
	}

	return Promise.resolve(newElements);
}

function mapElementType(elem : IntermediateElem) : string {
	if (isTitle(elem)) {
		return ArticleElementType.title;
	}

	if (isSubtitle(elem)) {
		return ArticleElementType.subtitle;
	}

	if (isFigure(elem)) {
		return ArticleElementType.figure;
	}

	if (isParagraph(elem)) {
		return ArticleElementType.paragraph;
	}

	return null;
}

function isTitle(elem : IntermediateElem) : boolean {
	return elem.type === 'h1';
}

const rxSubtitle = /(:?h2|h3|h4|h5|h6)/;

function isSubtitle(elem : IntermediateElem) : boolean {
	return rxSubtitle.test(elem.type);
}

function isFigure(elem : IntermediateElem) : boolean {
	return elem.type === 'img';
}

function isParagraph(elem : IntermediateElem) : boolean {
	return elem.type === 'p';
}
