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

import { flatten } from 'flat';

import Website from 'base/Website';

import * as app from 'app/util/applib';

const log = app.createLog();

interface Strings {
	common? : string;
	frontend? : string;
}

let strings : Strings;

export function initLocalizationStrings() : Promise <void> {
	return app.loadJSON('resources/localization.json5').then(data => {
		strings = Object.freeze(data);
		log('Localization strings loaded');
	});
}

export function getFrontendStrings(website : Website) : Promise <Object> {
	const allStrings = Object.assign({}, strings.common, strings.frontend);
	return Promise.resolve(flatten(applyLocale(allStrings, website.locale, 'en')));
}

function applyLocale(input : any, locale : string, fallback : string) : any {
	const a = {};

	Object.keys(input).forEach(key => {
		const o = input[key];

		if (isAllStrings(o)) {
			a[key] = o[locale] || o[fallback];
		}
		else {
			a[key] = applyLocale(o, locale, fallback);
		}
	});

	return a;
}

const isAllStrings = (o : any) => {
	return 0 >= Object.values(o).filter(a => typeof a !== 'string').length;
};
