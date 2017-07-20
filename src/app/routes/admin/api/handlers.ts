import {
	Request,
	Response,
} from 'express';

import {
	errorResponse,
	okResponse,
} from '../../api/apiResponse';

import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import {jwtOptions} from 'app/middleware/config/passportConfig';
import config from 'app/config';
import {IUser} from 'app/models/User';
import { EmptyError } from 'app/util/errors';
import * as app from 'app/util/applib';

const log = app.createLog();

const users: IUser[] = config.get('users');

export function apiLoginHandler(req: Request, res: Response): void {
	if (req.body.login && req.body.password) {
		// TODO rewrite it on DB added
		const user = users[_.findIndex(users, {login: req.body.login})];
		if (!user) {
			errorResponse(res, new Error('User not found'), 'User not found', {status: 401});
		} else {
			user.comparePassword(req.body.password, function (err: string, isMatch: boolean) {
				if (isMatch) {
					const payload = {id: user.id, login: user.login};
					const resUser = user.toString();
					resUser.token = jwt.sign(payload, jwtOptions.secretOrKey);
					okResponse(res, {user: resUser});
				} else {
					errorResponse(res, new Error('Incorrect password'), 'Incorrect password', {status: 401});
				}
			});
		}
	} else {
		res.status(403).json({message: 'Permission denied'});
	}
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
