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

import * as jwt from 'jsonwebtoken';

import {
	Request,
	Response,
} from 'express';

import {
	errorResponse,
	okResponse,
} from '../../api/apiResponse';

import { EmptyError } from 'app/util/errors';
import { User } from 'base';

import * as app from 'app/util/applib';

const log = app.createLog();

export function apiTestHandler(requ : Request, resp : Response) : void {
	try {
		log('Requesting users at', '');

		okResponse(resp);
	}
	catch (error) {
		const options = {
			status: 400,  // "Bad Request" in any case
		};

		if (error instanceof EmptyError) {
			errorResponse(resp, error, 'Mandatory URL parameter is missing or empty', options);
		}
		else {
			errorResponse(resp, error, 'URL parameter invalid', options);
		}
	}
}
