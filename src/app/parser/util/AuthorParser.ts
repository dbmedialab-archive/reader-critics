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
