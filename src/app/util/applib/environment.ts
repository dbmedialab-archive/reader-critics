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

import config from 'app/config';

// Application environment

/** The current environment that this app is running in */
const findEnvironment = () => {
	let e = process.env.NODE_ENV || null;
	if (0 > ['production', 'development', 'test'].indexOf(e)) {
		e = 'development';
	//	throw new Error(`Unknown execution environment "${e}"`);
		console.log(`Execution environment not set, assuming "${e}"`);
	}
	return e;
};

export const env : string = findEnvironment();

export const isProduction : boolean = process.env.NODE_ENV === 'production';
export const isDevelop : boolean = process.env.NODE_ENV === 'development';
export const isTest : boolean = process.env.NODE_ENV === 'test';

export const locale : string = config.get('localization.systemLocale');
