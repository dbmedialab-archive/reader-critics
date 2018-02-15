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

import { Request, Response } from 'express';
import { feedbackService } from 'app/services';
import { errorResponse, okResponse } from './apiResponse';

import * as app from 'app/util/applib';

const log = app.createLog();

export default function (requ : Request, resp : Response) : void {
	log(app.inspect(requ.body));
	// Store the new feedback
	feedbackService.validateAndSave(requ.body)
	// Reply with only the one-shot token in the response.
	// No e-mail notification is triggered here! The cron takes care of this.
	.then(newFeedback => okResponse(resp, {
		updateToken: newFeedback.oneshotUpdateToken,
	}))
	// Catch them nasty errors
	.catch(error => errorResponse(resp, error));
}
