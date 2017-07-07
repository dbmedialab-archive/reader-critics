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
