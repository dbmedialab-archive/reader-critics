import User from '../models/User';
import jwt from 'jsonwebtoken';
import config from '../config';

const adminUser = new User('admin', 'admin', 'test');

function authenticate(req, res, next) {
	if (req.body.login && req.body.password) {
		adminUser.comparePassword(req.body.password, (isMatch) => {
			if (isMatch) {
				req.user = adminUser;
			}
			next();
		});
	}
	return next();
}

function generateToken (req, res, next) {
	if (!req.user) {
		return next();
	}

	const jwtPayload = {
		id: req.user.id,
	};

	const jwtData = {
		expiresIn: config.jwt.jwtDuration,
	};

	const secret = config.jwt.jwtSecret;
	req.token = jwt.sign(jwtPayload, secret, jwtData);
}

function respondJWT (req, res) {
	if (!req.user) {
		res.status(401).json({
			error: 'Unathorized',
		});
	} else {
		res.status(200).json({
			jwt: req.token,
		});
	}
}

export default { authenticate, generateToken, respondJWT };
