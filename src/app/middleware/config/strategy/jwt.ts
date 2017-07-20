import {
	ExtractJwt,
	Strategy as JwtStrategy,
	StrategyOptions,
} from 'passport-jwt';

import { User } from 'base';
import { userService } from 'app/services';
import { RetrieveCallback } from '../passportConfig';

import config from 'app/config';

export const options : StrategyOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeader(),
	secretOrKey: config.get('auth.jwt.secret'),
};

function verify(jwtPayload, done : RetrieveCallback) {
	userService.get(jwtPayload.username).then((user : User) => {
		done(user === null ? 'User not found' : null, user)
	});
};

export const jwtStrategy = new JwtStrategy(options, verify);
