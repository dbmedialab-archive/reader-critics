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
	bulkResponse,
	errorResponse,
	okResponse,
} from 'app/routes/api/apiResponse';

import { userService } from 'app/services';

import emptyCheck from 'app/util/emptyCheck';
import pagination from 'app/util/pagination';

/*
 * Create new user
 */
export function create(requ : Request, resp : Response) : void {
	emptyCheck(requ.body);
	userService.validateAndSave(requ.body)
	.then(user => okResponse(resp, user))
	.catch(error => errorResponse(resp, error));
}

/*
 * Show list of users. pagination included
 */
export function list(requ : Request, resp : Response) : void {
	const params = pagination(requ);
	userService.getRange(params.skip, params.limit, params.sort)
	.then(users => bulkResponse(resp, users))
	.catch(err => errorResponse(resp, undefined, err, { status: 500 }));
}

/*
 * Delete user by ID parameter
 */
export function doDelete(requ : Request, resp : Response) : void {
	userService.doDelete(requ.params.id)
	.then(result => okResponse(resp, result))
	.catch(err => errorResponse(resp, err));
}

/*
 * Update user by ID
 * Doesn't affect user password
 */
export function update(requ : Request, resp : Response) : void {
	userService.validateAndUpdate(requ.params.id, requ.body)
	.then(result => okResponse(resp, result))
	.catch(err => errorResponse(resp, err));
}
