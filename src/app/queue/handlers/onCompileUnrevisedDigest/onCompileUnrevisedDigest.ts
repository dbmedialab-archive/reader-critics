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

import * as app from 'app/util/applib';
import * as moment from 'moment';

import {
	DoneCallback,
	Job,
} from 'kue';

import {
	articleService,
//	websiteService,
} from 'app/services';

const log = app.createLog();
const dateRegex = /:00\.000Z$/;

// TODO Flag in Website zur Aktivierung des Digest
// TODO websiteService.getAll([flags/query])
// TODO website-Parameter auf articleService.getNonUpdated()
// TODO nach Wochenenden die Query-Zeitdauer bis zum vorigen Freitag berechnen
// TODO Mailtemplate undsoweiter

export function onCompileUnrevisedDigest(job : Job, done : DoneCallback) : void {
	const latestCreated = moment().second(0).millisecond(0)
		.toDate();
	const earliestCreated = moment(latestCreated)
		.subtract(moment.duration({ hours: 24 }))
		.toDate();

	log(
		'Checking articles between %s and %s',
		earliestCreated.toISOString().replace(dateRegex, 'Z'),
		latestCreated.toISOString().replace(dateRegex, 'Z')
	);

	articleService.getUnrevised(latestCreated, earliestCreated)
	.then(articles => {
		articles.forEach(article => {
			log(article.ID, article.url);
		});
	})
	.then(() => {
		done();
		return null;
	});
}
