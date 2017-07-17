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

import {
	ArticleURL,
	Website,
} from 'base';

import {
	WebsiteDocument,
	WebsiteModel,
} from 'app/db/models';

import {
	clearCollection,
	wrapFindOne,
	wrapSave
} from 'app/db/common';

export function clear() : Promise <void> {
	return clearCollection(WebsiteModel);
}

export function identify(articleURL : ArticleURL) : Promise <Website> {
	// TODO parameter null check
	return wrapFindOne <WebsiteDocument, Website> (WebsiteModel.findOne({
		'hosts': articleURL.url.hostname,
	}));
}

export function save(website : Website) : Promise <void> {
	// TODO parameter null check
	return wrapSave(new WebsiteModel(website).save());
}
