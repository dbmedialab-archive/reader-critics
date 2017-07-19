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
	Request,
	Response,
} from 'express';
import { default as axios } from 'axios';

import { Suggestion } from 'base/';
import { SuggestionModel } from 'app/db/models';
import { errorResponse, okResponse } from './apiResponse';

import * as app from 'app/util/applib/logging';
const log = app.createLog();

const maxEmailLength = 254;
const maxCommentLength = 2000;

const adjust = (requ : Request, field : string, len : number) => (
	String(requ.body[field]).valueOf().substr(0, len)
);

function sendSuggestion(requ){
	const email = adjust(requ, 'email', maxEmailLength);
	const comment = adjust(requ, 'comment', maxCommentLength);

	const suggest : Suggestion = {
		email,
		comment,
		remote: {
			ipAddress: requ.connection.remoteAddress.toString(),
			userAgent: (requ.headers['user-agent'] || '').toString(),
		},
	};

	log('Received comment from "%s"', email);
	return new SuggestionModel(suggest).save();
}

function getErrorCode (errorCode) {
	const ERROR_CODES = {
		'missing-input-secret': 'Unexpected Server Error (1)',
		'invalid-input-secret': 'Unexpected Server Error (2)',
		'missing-input-response': 'Missing reCAPTCHA value',
		'invalid-input-response': 'Invalid reCATPCHA value',
		'timeout-or-duplicate': 'The validation has timed out and is no longer valid',
		'bad-request': 'The request is invalid or malformed',
	};
	if (Array.isArray(errorCode)) {
		const errors = errorCode.map(function (code) {
			return getErrorCode(code);
		});
		return errors.join('\r\n');
	}
	return ERROR_CODES[errorCode] || (
		errorCode ? ('Unexpected reCAPTCHA error: ' + errorCode) : 'Unexpected reCAPTCHA error');
}

export default function(requ : Request, resp : Response) : void {
	if (!requ.body.captcha) {
		const msg = 'Missing captcha parameter';
		return errorResponse(resp, new Error(msg), msg, {
			status: 400,
		});
	}
	const secretKey = '6LdTeikUAAAAAIRt_4uVbT3HlZLUrHb3EeeqDtti';
	const captchaVerifyURL = 'https://www.google.com/recaptcha/api/siteverify?secret='
	+secretKey+'&response='+requ.body.captcha+'&remoteip='+requ.connection.remoteAddress.toString();
	axios.post(captchaVerifyURL)
		.then(function(response) {
			console.log(response);
			if (response.data && response.data.success) {
				sendSuggestion(requ)
					.then(() => {
						okResponse(resp, { sent: true });
					})
					.catch(error => errorResponse(resp, error));
			} else {
				const msg = getErrorCode(response.data['error-codes']);
				errorResponse(resp, new Error(msg), msg, {
					status: 400,
				});
			}
		});
}
