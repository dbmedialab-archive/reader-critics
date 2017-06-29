import User from '../models/User';
import * as jwt from 'jsonwebtoken';
import config from '../config';
import * as app from 'app/util/applib';

const log = app.createLog();

const adminUser = new User({name: 'admin', login: 'admin', password: 'test'});

function authenticate(req, res, next) {
	if (req.body.login && req.body.password) {
		adminUser.comparePassword(req.body.password, function (isMatch: boolean) {
			if (isMatch) {
				req.user = adminUser;
			}
			log('User added to request');
			next();
		});
	} else {
		log('User not added to request');
		next();
	}
}

function generateToken (req, res, next) {
	if (!req.user) {
		return next();
	}
	const jwtConf = config.get('jwt');

	const jwtPayload = {
		id: req.user.id,
	};

	const jwtData = {
		expiresIn: jwtConf.jwtDuration,
	};

	const secret = jwtConf.jwtSecret;
	req.token = jwt.sign(jwtPayload, secret, jwtData);
	log('Token generated');
}

function respondJWT (req, res) {
	if (!req.user) {
		log('Unauthorized');
		res.status(401).json({
			error: 'Unathorized',
		});
	} else {
		log('Authorized');
		res.status(200).json({
			jwt: req.token,
		});
	}
}

export default { authenticate, generateToken, respondJWT };
