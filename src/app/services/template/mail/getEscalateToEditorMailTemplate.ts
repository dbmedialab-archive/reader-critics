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

import * as doT from 'dot';
import * as path from 'path';

import MailTemplate from 'app/template/MailTemplate';

import * as app from 'app/util/applib';
import Website from 'base/Website';
import emptyCheck from 'app/util/emptyCheck';
import chooseTemplate from 'app/services/template/chooseTemplate';

const log = app.createLog();
const defaultTemplate = path.join('templates', 'mail', 'defaultFeedbackNotify.html');

export function getEscalateToEditorMailTemplate(website : Website) : Promise <MailTemplate> {
	emptyCheck(website);

	return chooseTemplate(website.layout.templates.feedbackNotificationMail, defaultTemplate)
		.then((raw : string) => {
			log('Mail notification template loaded');
			return new MailTemplate (doT.template(raw));
		});
}
