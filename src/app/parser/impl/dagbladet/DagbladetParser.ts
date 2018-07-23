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
import AbstractLabradorParser from 'app/parser/AbstractLabradorParser';
import IteratingParserItem from 'app/parser/IteratingParserItem';

export default class DagbladetParser extends AbstractLabradorParser {

	// Implement AbstractParser

	protected isParagraph(
		item : IteratingParserItem,
		select : Cheerio
	) : boolean {
		const $element = select(item.elem);
		const isAnnounce = $element.hasClass('text-darkgrey');
		const withinArticle = $element.parents('article').length === 1;
		const withinSection = $element.parents('aside').length === 1;

		return item.name === 'p'
			&& withinArticle
			&& !withinSection
			&& !isAnnounce
			&& item.text.length > 0;
	}

}
