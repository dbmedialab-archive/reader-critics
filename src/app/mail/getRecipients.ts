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

import { uniq } from 'lodash';

import Article from 'base/Article';
import Person from 'base/zz/Person';
import Website from 'base/Website';

import { EmptyError } from 'app/util/errors';

import config from 'app/config';
import * as app from 'app/util/applib';

const msgNoRcpt = 'Could not determine recipients for feedback notification e-mail';

// If this e-mail address is set in the configuration, every outgoing e-mail
// will be sent there instead of the article authors or editors. This is mainly
// for testing purposes and is therefore disabled in production mode.
const override : string = config.get('mail.testOverride');

export function getRecipients(
	website : Website,
	article : Article,
	includeEditors : boolean = false
) : Promise <Array <string>> {
	if (override && !app.isProduction) {
		return Promise.resolve([ override ]);
	}

	let recipients : Array <string> = filterForMailAddr(article.authors);

	if (recipients.length <= 0 || includeEditors) {
		recipients = filterForMailAddr(website.chiefEditors);
	}

	// If the list of recipients is still empty here then we can't really do
	// anything about that. The caller function will have to deal with it.
	if (recipients.length <= 0) {
		return Promise.reject(new EmptyError(msgNoRcpt));
	}

	return Promise.resolve(uniq(recipients));
}

const filterForMailAddr = (people : Array <Person>) : Array <string> => (
	people.filter((p : Person) => p.email.length > 0)
	.map((author : Person) => author.email)
);
