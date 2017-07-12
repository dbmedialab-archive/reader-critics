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

export default function(requ : Request, resp : Response) : void {
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

	new SuggestionModel(suggest).save().then(() => {
		okResponse(resp, { sent: true });
	})
	.catch(error => errorResponse(resp, error));
}
