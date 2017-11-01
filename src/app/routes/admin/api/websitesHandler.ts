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

import {parserService, websiteService} from 'app/services';
import pagination from 'app/util/pagination';

/**
 * Provides with whole list of existing websites
 */
export function list (requ: Request, resp: Response) {
	const notFound = 'Resourse not found';
	const params = pagination(requ);
	Promise.all([
		websiteService.getRange(params.skip, params.limit, params.sort),
		parserService.getParsersRange(),
	]).then(data => {
		const [websites, parsers = []] = data;
		if (websites.length > 0) {
			okResponse(resp, {websites, options: {parsers}});
		} else {
			errorResponse(resp, undefined, notFound, { status: 404 });
		}

	}).catch((err) => {
		errorResponse(resp, undefined, err.stack, { status: 500 });
	});
}

/**
 * Provides the website entity by name
 */
export function show (requ: Request, resp: Response) {
	let notFound = 'Resourse not found';
	const { name } = requ.params;
	if (!name) {
		notFound = 'Website name must be set';
		return errorResponse(resp, undefined, notFound, { status: 404 });
	}
	Promise.all([
		websiteService.get(name),
		parserService.getParsersRange(),
	]).then(data => {
		const [website, parsers = []] = data;
		if (website) {
			okResponse(resp, {website, options: {parsers}});
		} else {
			errorResponse(resp, undefined, notFound, { status: 404 });
		}
	}).catch((err) => {
		errorResponse(resp, undefined, err.stack, { status: 500 });
	});
}

/**
 * Updates the website entity by name
 */
export function update (requ: Request, resp: Response) {
	let notFound = 'Resourse not found';
	const { name } = requ.params;
	const body = requ.body;
	if (!name) {
		notFound = 'Website name must be set';
		return errorResponse(resp, undefined, notFound, { status: 404 });
	}
	websiteService
		.validateAndUpdate(name, body)
		.then((wsite) => okResponse(resp, wsite))
		.catch(error => errorResponse(resp, error));
}

/**
 * Updates the website entity by name
 */
export function create (requ: Request, resp: Response) {
	const body = requ.body;

	websiteService
		.save(body)
		.then((wsite) => okResponse(resp, wsite))
		.catch(error => errorResponse(resp, error));
}
