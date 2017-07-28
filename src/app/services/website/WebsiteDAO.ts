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

import { isString } from 'lodash';

import ArticleURL from 'base/ArticleURL';
import Website from 'base/Website';

import { WebsiteModel } from 'app/db/models';

import {
	wrapFindOne,
	wrapSave
} from 'app/db/common';

import emptyCheck from 'app/util/emptyCheck';

/**
 * Returns a single Website object if the exact name is found in the database.
 * "name" is the primary key on the websites collection.
 */
export function get(name : string) : Promise <Website> {
	emptyCheck(name);
	return wrapFindOne(WebsiteModel.findOne({ name }));
}

export function identify(articleURL : ArticleURL|string) : Promise <Website> {
	emptyCheck(articleURL);
	let hostname : string;

	if (isString(articleURL)) {
		const url = new URL(articleURL);
		hostname = url.hostname;
	}
	else {
		hostname = articleURL.url.hostname;
	}

	return wrapFindOne (WebsiteModel.findOne({ 'hosts': hostname }));
}

export function save(website : Website) : Promise <void> {
	emptyCheck(website);
	return wrapSave(new WebsiteModel(website).save());
}
