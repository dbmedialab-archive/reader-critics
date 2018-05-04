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

// Get recipients for an article; collects the e-mail addresses from all article
// authors and adds the website's editors if this is requested, or if the list
// of article authors is empty (happens often on articles from external sources)

export function getRecipients(
	website : Website,
	article : Article,
	includeEditors : boolean = false
) : Promise <Array <string>>
{
	if (override && !app.isProduction) {
		return Promise.resolve([ override ]);
	}

	// If feedback email override to dedicated addresses is set for website
	// then send messages there only instead of article authors
	if (website.feedbackEmailOverride && website.feedbackEmailOverride.length) {
		return Promise.resolve(website.feedbackEmailOverride);
	}

	let recipients : Array <string> = filterForMailAddr(article.authors);

	if (recipients.length <= 0 || includeEditors) {
		recipients = recipients.concat(filterForMailAddr(website.chiefEditors));
	}

	// If the list of recipients is still empty here then we can't really do
	// anything about that. The caller function will have to deal with it.
	if (recipients.length <= 0) {
		return Promise.reject(new EmptyError(`${msgNoRcpt} (${website.name})`));
	}

	return Promise.resolve(uniq(recipients));
}

// Get a specific list of recipients for a website. Currently, only the "editors"
// list is defined.

export enum MailRecipientList {
	Editors,
}

export function getRecipientList(
	website : Website,
	recipientList : MailRecipientList
) : Promise <Array <string>>
{
	if (override && !app.isProduction) {
		return Promise.resolve([ override ]);
	}

	let recipients;

	switch (recipientList) {
		case MailRecipientList.Editors:
			recipients = website.chiefEditors;
	}

	// If the list of recipients is still empty here then we can't really do
	// anything about that. The caller function will have to deal with it.
	if (recipients.length <= 0) {
		return Promise.reject(new EmptyError(`${msgNoRcpt} (${website.name})`));
	}

	return Promise.resolve(uniq(filterForMailAddr(recipients)));
}

// Extract e-mail addresses from an array of <Person> objects

const filterForMailAddr = (people : Array <Person>) : Array <string> => (
	people.filter((p : Person) => typeof p.email === 'string' && p.email.length > 0)
	.map((author : Person) => author.email)
);
