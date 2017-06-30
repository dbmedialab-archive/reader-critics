import User from '../models/User';
import * as jwt from 'jsonwebtoken';
import config from '../config';
import * as app from 'app/util/applib';
import {ExtractJwt, Strategy as JwtStrategy} from 'passport-jwt';

const log = app.createLog();

const adminUser = new User({name: 'admin', login: 'admin', password: 'test'});
const jwtConf = config.get('jwt');

const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeader(),
	secretOrKey: jwtConf.jwtSecret,
};

const jwtStrategy = new JwtStrategy(jwtOptions, (jwtPayload, next) => {
	log('payload received');
	log(jwtPayload);
	if (adminUser && adminUser.id === jwtPayload.id) {
		next(null, adminUser);
	} else {
		next(null, false);
	}
});

function loginHandler(req, res) {
	if (req.body.login && req.body.password) {
		if (adminUser.login !== req.body.login) {
			return res.status(401).json({message: 'User not found'});
		}

		adminUser.comparePassword(req.body.password, function (isMatch: boolean) {
			if (isMatch) {
				req.user = adminUser;
				const payload = {id: adminUser.id};
				const token = jwt.sign(payload, jwtOptions.secretOrKey);
				res.json({message: 'ok', token: token});
			} else {
				res.status(401).json({message: 'password did not match'});
			}
		});
	}
}

function serializeUser(user, done) {
	done(null, user.id);
}

function deserializeUser(id, done) {
	if (adminUser.id === id) {
		done(null, adminUser);
	} else {
		done('User not found');
	}
}

export default { jwtStrategy, loginHandler, serializeUser, deserializeUser };
