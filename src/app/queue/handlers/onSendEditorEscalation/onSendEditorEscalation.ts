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
	DoneCallback,
	Job,
} from 'kue';

// import {
// 	articleService,
// 	feedbackService,
// } from 'app/services';

import Article from 'base/Article';
// import Website from 'base/Website';

import * as app from 'app/util/applib';

const log = app.createLog();

export function onSendEditorEscalation(job : Job, done : DoneCallback) : void {
	const { article } : { article : Article } = job.data;

	// First, check if there are any receipients available for this operation
	if (article.website.chiefEditors.length < 1) {
		log(`Website ${article.website.name} has no editors configured. Escalation mail not sent.`);
		return done();
	}
}
