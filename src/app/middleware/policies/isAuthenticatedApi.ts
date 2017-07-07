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
		// if (req.headers.authorization) {
		// 	const authHeader = req.headers.authorization.split(' ');
		// 	if (authHeader[0] === 'JWT') {
		// 		const token = authHeader[1];
		// 		return jwt.verify(token, jwtOptions.secretOrKey, (err, decoded) => {
		// 			if (err) {
		// 				return res.status(401).json('Unauthorized');
		// 			}
		//
		// 			const userId = decoded.id;
		// 			const user = users[_.findIndex(users, {id: userId})];
		//
		// 			if (user) {
		// 				return next();
		// 			}
		// 			return res.status(401).json('Unauthorized');
		// 		});
		// 	}
		// } else {
		// 	res.status(401).json('Unauthorized');
		// }
	}
}
