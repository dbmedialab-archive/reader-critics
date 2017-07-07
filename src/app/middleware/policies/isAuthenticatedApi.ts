import * as _ from 'lodash';
import * as jwt from 'jsonwebtoken';
import { jwtOptions } from 'app/middleware/config/passportConfig';
import * as passport from 'passport';
import config from 'app/config';

const users = config.get('users');
const jwtSession = config.get('jwt').session;

export default function isAuthenticated(req, res, next: () => void): void {
	if (req.isAuthenticated()) {
		return next();
	} else {
		return passport.authenticate('jwt', jwtSession)(req, res, next);
	}
}
