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

import {
	errorResponse,
	okResponse,
} from 'app/routes/api/apiResponse';

import { feedbackService } from 'app/services';

/**
 * Provides with whole list of existing feedbacks
 * Not filtering, no page or limit query params are taken into account
 */
export function list (requ: Request, resp: Response) {
	const notFound = 'Resourse not found';
	feedbackService.getRange().then((fbacks) => {
		if (fbacks.length > 0) {
			okResponse(resp, fbacks);
		} else {
			errorResponse(resp, undefined, notFound, { status: 404 });
		}

	}).catch((err) => {
		errorResponse(resp, undefined, err.stack, { status: 500 });
	});
}
