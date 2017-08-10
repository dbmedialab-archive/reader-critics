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
import { options as jwtOptions } from 'app/middleware/config/strategy/jwt';
import { User } from 'base';
import { userService, feedbackService } from 'app/services';

import {
	FeedbackModel
} from 'app/db/models';

import * as app from 'app/util/applib';

const log = app.createLog();

export function apiLoginHandler(requ : Request, resp : Response) : void {
	// Use the same message for every error type to prevent attacks.
	// For example, saying "Wrong password" will tell a attackers that they
	// already found a valid username.
	const message = 'Permission denied';

	if (!(requ.body.login && requ.body.password)) {
		errorResponse(resp, undefined, message, { status: 403 });
	}

	let user : User;

	userService.get(requ.body.login).then((u : User) => {
		if (user === null) {
			return Promise.reject(new Error(message));
		}

		user = u;
		return userService.checkPassword(user, requ.body.password);
	})
	.then((authenticated : boolean) => {
		if (!authenticated) {
			return Promise.reject(new Error(message));
		}

		const payload = {
			username: user.name,
		};

		const data = Object.assign({}, payload, {
			token: jwt.sign(payload, jwtOptions.secretOrKey),
		});

		okResponse(resp, data);
	})
	.catch(error => {
		errorResponse(resp, error, message, { status: 401 });
	});
}

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

/**
 * Provides with whole list of existing feedbacks
 * Not filtering, no page or limit query params are taken into account 
 */
export function fbListHandler (requ: Request, resp: Response) : void {
	//@TODO check auth
	//@TODO pagination params
	const notFound = "Resourse not found";

	/*FeedbackModel.find({}).populate("_article").exec(function(err, feedbc){	
	});*/
	feedbackService.getRange().then((fbacks) => {
		if (fbacks.length) {
			okResponse(resp, fbacks);
		} else {
			errorResponse(resp, undefined, notFound, { status: 404 });
		}
		
	}).catch((err) => {
		errorResponse(resp, undefined, err.stack, { status: 500 });
	});
}

