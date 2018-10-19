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

import * as path from 'path';
import * as app from 'app/util/applib';

import { isArray, isString } from 'lodash';
import { URL } from 'url';

import ArticleURL from 'base/ArticleURL';
import Website from 'base/Website';

import emptyCheck from 'app/util/emptyCheck';

const demoSites = path.join('resources', 'website', 'demo-sites.json5');
const websiteCache : Website[] = [];

export function identify(articleURL : ArticleURL|string) : Promise <Website> {
	emptyCheck(articleURL);

	const url = new URL(isString(articleURL) ? articleURL : articleURL.href);
	const hostname = url.hostname;
	return initialPromise()
	.then(() => websiteCache.filter(thatSite => thatSite.hosts.includes(hostname)))
	.then(websites => websites[0]);
}

const initialPromise = () => (websiteCache.length <= 0)
	? loadDemoWebsites()
	: Promise.resolve();

function loadDemoWebsites() : Promise <void> {
	return app.loadJSON(demoSites).then(data => {
		if (isArray(data)) {
			data.forEach(item => websiteCache.push(item));
		}
	});
}
