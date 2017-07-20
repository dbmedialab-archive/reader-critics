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
import { userService } from 'app/services';

import config from 'app/config';

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
