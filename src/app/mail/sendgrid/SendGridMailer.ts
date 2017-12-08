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

import * as app from 'app/util/applib';

import { ConfigError } from 'app/util/errors';

// I have yet to figure out how to properly import the new SendGrid module
// with ES6 syntax, so far TS has rejected every single attempt. Use require-
// syntax for now and silence the linter.
// tslint:disable no-require-imports
const sendgridMail = require('@sendgrid/mail');

const log = app.createLog();

const apiKey : string = config.get('mail.sendgrid.api_key');
const senderDomain : string = config.get('mail.sender.domain');

const bccRecipient : Array <string> = (() => {
	const bcc = config.get('mail.bccRecipient');
	return bcc === undefined ? [] : bcc.split(/,/);
})();

export default function(
	recipients : Array <string>,
	subject : string,
	htmlContent : string
) : Promise <any>
{
	if (apiKey.length <= 0) {
		return Promise.reject(new ConfigError('SendGrid API key is not configured'));
	}

	log(`Sending e-mail to ${recipients.join(', ')}`);

	if (app.isTest) {
		log(`Not sending in test mode`);
		return Promise.resolve();
	}

	sendgridMail.setApiKey(apiKey);

	const options : any = {
		to: recipients,
		from: `no-reply@${senderDomain}`,
		subject,
		html: htmlContent,
	};

	if (bccRecipient.length > 0) {
		options.bcc = bccRecipient;
	}

	return sendgridMail.send(options);
}
