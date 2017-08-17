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

import { feedbackService } from 'app/services';

import {
	errorResponse,
	okResponse,
} from './apiResponse';

export function feedbackPostHandler(requ : Request, resp : Response) : void {
	feedbackService.validateAndSave(requ.body)
	.then((doc) => okResponse(resp, {ID: doc.ID}))
	.catch(error => errorResponse(resp, error));
}

export function feedbackUpdateHandler(requ : Request, resp : Response) : void {
	feedbackService.validateAndUpdate(requ.params.id, requ.body)
		.then((doc) => okResponse(resp, {ID: doc.ID}))
		.catch(error => errorResponse(resp, error));
}
