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

import * as Cheerio from 'cheerio';

export function create(rawArticle : string) : Promise <Cheerio> {
	return Promise.resolve(Cheerio.load(rawArticle, {
		ignoreWhitespace: true,
		xmlMode: false,
		lowerCaseTags: true,
	}));
}

export const trimText = (str : string) =>
	str === undefined ? '' : str.replace(/[\r\n\t\s]+/g, ' ').trim();

//
// convert texts taken from list of <li> to solid text
//  - delete extra whitespaces inside of the each li's text, saving regular sentences  ". "
//  - delete sing '.' and extra whitespaces at the end of the each  li's text
//  - join li's texts in one string adding to the each li's text ' .'  to form sentences
// Example:
//     <li>Indre spenning.      Indre spenning . Indre spenning. </li>
//     <li><a href="#">Redusert nattesøvn    .      </a></li>
//
// result => "Indre spenning. Indre spenning. Indre spenning. Redusert nattesøvn."
//

export const listToParagraph = (elem : Cheerio): string => {
	const text = [];
	const items = Cheerio(elem).children();
	items.each((i, el) => {
		text[i] =  Cheerio(el).text().trim().replace(/\s*\.\s*/g, '. ').replace(/\s*\.\s*$/, '');
	});
	return text.join('. ');
};

export const formatText = (elem : Cheerio): string => {
	return elem.name === 'ul' || elem.name === 'ol' ?
		listToParagraph(elem) : trimText(Cheerio(elem).text());
};

export const splitCSS = (css : string) =>
	css === undefined ? [] : css.replace(/\s+/, ' ').split(' ');

export const getElemID = (id : string) =>
	id === undefined ? undefined : id.trim();
