import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import config from '../config';
import * as app from 'app/util/applib';
import {jwtOptions} from './config/passportConfig';
import {IUser} from 'app/models/User';

const log = app.createLog();
const users: IUser[] = config.get('users');

export function apiLoginHandler(req, res) {
	if (req.body.login && req.body.password) {
		// TODO rewrite it on DB added
		const user = users[_.findIndex(users, {login: req.body.login})];
		if (!user) {
			return res.status(403).json({message: 'User not found'});
		}

		user.comparePassword(req.body.password, function (isMatch: boolean) {
			if (isMatch) {
				const payload = {id: user.id, login: user.login};
				const resUser = user.toString();
				req.user = user;
				resUser.token = jwt.sign(payload, jwtOptions.secretOrKey);
				res.json({message: 'ok', user: resUser});
			} else {
				res.status(403).json({message: 'password did not match'});
			}
		});
	}
}

export function loginHandler(req, res) {
	if (req.body.login && req.body.password) {
		// TODO rewrite it on DB added
		const user = users[_.findIndex(users, {login: req.body.login})];
		if (!user) {
			return res.status(403).json({message: 'User not found'});
		}

		user.comparePassword(req.body.password, function (isMatch: boolean) {
			if (isMatch) {
				const payload = {id: user.id, login: user.login};
				const resUser = user.toString();
				req.user = user;
				resUser.token = jwt.sign(payload, jwtOptions.secretOrKey);
				res.redirect('testpage');
			} else {
				res.status(403).json({message: 'password did not match'});
			}
		});
	}
}

export default { apiLoginHandler };
