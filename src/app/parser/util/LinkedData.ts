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
import * as JSON5 from 'json5';

export interface LinkedData {
	// There are many other properties in Schema.org's linked data, these
	// are the most interesting ones:
	author?: string | {
		email?: string
		name: string
	}
	publisher?: {}
	headline?: string
	image?: string[]
	datePublished: string
	dateModified: string
	description?: string
}

export function getLinkedData(select : Cheerio) : LinkedData {
	const ldElem = select('script[type="application/ld+json"]').first();
	if (!ldElem) {
		return undefined;
	}

	// Surprisingly .text() doesn't work here so we have to use .html() instead.
	// This seems a bit strange, since the content of <script> is a DOM text node.
	const ldRaw = select(ldElem).html();
	if (!ldRaw) {
		return undefined;
	}

	try {
		return JSON5.parse(ldRaw);
	}
	catch (error) {
		return undefined;
	}
}
