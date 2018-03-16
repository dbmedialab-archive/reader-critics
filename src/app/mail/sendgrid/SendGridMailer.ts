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
const bccRecipients : Array <string> = (config.get('mail.bccRecipient') || '').split(/,/);
// const override : string = config.get('mail.testOverride');

export type SendGridMailerOptions = {
	highPriority? : boolean
};

export default function(
	recipients : Array <string>,
	subject : string,
	htmlContent : string,
	options : SendGridMailerOptions = {}
) : Promise <any>
{
	if (apiKey.length <= 0) {
		return Promise.reject(new ConfigError('SendGrid API key is not configured'));
	}

	if (app.isTest) {
		log('(Not) Sending e-mail (in test mode) to', recipients.join(', '));
		return Promise.resolve();
	}

	log('Sending e-mail to', recipients.join(', '));
	sendgridMail.setApiKey(apiKey);

	const message : any = {
		to: recipients,
		from: `no-reply@${senderDomain}`,
		bcc: bccRecipients.filter((rcpt : string) => !recipients.includes(rcpt)),
		subject,
		html: htmlContent,
		isMultiple: true,
		headers: {},
		trackingSettings: {
			clickTracking: {
				enable: false,
			},
			ganalytics: {
				enable: false,
			},
		},
	};

	if (options && options.highPriority) {
		// https://sendgrid.com/blog/magic-email-headers/
		Object.assign(message.headers, {
			'X-Priority': '1 (Highest)',
			'X-MSMail-Priority': 'High',
			'Importance': 'High',
		});
	}

	return sendgridMail.send(message);
}
