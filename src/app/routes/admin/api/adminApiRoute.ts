import {
	Request,
	Response,
	Router,
} from 'express';

import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as app from 'app/util/applib';
import config from 'app/config';
import {IUser} from 'app/models/User';
import usersHandler from './usersHandler';
import {jwtOptions} from 'app/middleware/config/passportConfig';

const users: IUser[] = config.get('users');

const log = app.createLog();

const adminApiRoute : Router = Router();

adminApiRoute.use(bodyParser.json({
	inflate: true,
	limit: '512kb',
	strict: true,
}));
adminApiRoute.use(cookieParser());

/**
 * All api request that have to pass without authentication have to be placed here
 */
adminApiRoute.post('/login', apiLoginHandler);

// Protecting routes with jwt
adminApiRoute.use('/*', passport.authenticate('jwt', {session: false}));
/**
 * All api request that have NOT to to pass without authentication have to be placed here
 */
adminApiRoute.get('/users', usersHandler);
adminApiRoute.get('/*', defaultHandler);

export default adminApiRoute;

function defaultHandler(requ: Request, resp: Response) : void {
	log('Admin api router', requ.params);
	resp.status(404).end('Unknown admin api endpoint\n');
}

function apiLoginHandler(req, res) {
	if (req.body.login && req.body.password) {
		// TODO rewrite it on DB added
		const user = users[_.findIndex(users, {login: req.body.login})];
		if (!user) {
			return res.status(403).json({message: 'User not found'});
		}

		user.comparePassword(req.body.password, function (err: string, isMatch: boolean) {
			if (isMatch) {
				const payload = {id: user.id, login: user.login};
				const resUser = user.toString();
				req.user = user;
				resUser.token = jwt.sign(payload, jwtOptions.secretOrKey);
				res.json({status: 'ok', user: resUser});
			} else {
				res.status(403).json({message: 'password did not match'});
			}
		});
	} else {
		res.status(403).json({message: 'Permission denied'});
	}
}
