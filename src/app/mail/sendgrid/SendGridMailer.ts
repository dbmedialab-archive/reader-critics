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

import * as sendgrid from 'sendgrid';
import { mail as helper } from 'sendgrid';

import config from 'app/config';

import * as app from 'app/util/applib';

const log = app.createLog();

export default function(feedback : string) {
	log('Preparing e-mail');
	const fromEmail = new helper.Email('test@leserkritikk.no');
	const toEmail = new helper.Email('philipp@sol.no');

	const subject = 'Du har fått tilbakemelding på artikkelen:';
	const content = new helper.Content('text/html', htmlContent.replace('#####', feedback));

	const mail = new helper.Mail(fromEmail, subject, toEmail, content);

	const sg = sendgrid(config.get('mail.sendgrid.api_key'));
	const requ = sg.emptyRequest({
		method: 'POST',
		path: '/v3/mail/send',
		body: mail.toJSON(),
	});

	sg.API(requ)
	.then(response => {
		log('---------------------------------------------------------------------------------------');
		log(response);
		// log(response.statusCode);
		// log(response.body);
		// log(response.headers);
		log('---------------------------------------------------------------------------------------');
	})
	.catch(error => console.log(error));
}

/*
var helper = require('sendgrid').mail;
var fromEmail = new helper.Email('test@example.com');
var toEmail = new helper.Email('test@example.com');
var subject = 'Sending with SendGrid is Fun';
var content = new helper.Content('text/plain', 'and easy to do anywhere, even with Node.js');
var mail = new helper.Mail(fromEmail, subject, toEmail, content);

var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
var request = sg.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: mail.toJSON()
});

sg.API(request, function (error, response) {
  if (error) {
    console.log('Error response received');
  }
  console.log(response.statusCode);
  console.log(response.body);
  console.log(response.headers);
});
*/

const htmlContent = '<!DOCTYPE html>\
<html lang="no">\
<head>\
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">\
		<meta charset="utf-8">\
		<style>\
			html, body {\
				color: #333333;\
				background-color: #eeeeee;\
				font-family: \'Roboto\', \'Noto Sans\', \'Arial\', sans-serif;\
			}\
			h1 { color: rgba(185, 79, 112, 1); }\
		</style>\
</head>\
<body>\
<h1>Du har fått tilbakemelding på artikkelen</h1>\
<pre>#####</pre>\
</body>\
</html>';
