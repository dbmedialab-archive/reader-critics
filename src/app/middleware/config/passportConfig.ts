import * as _ from 'lodash';
import {ExtractJwt, Strategy as JwtStrategy} from 'passport-jwt';
import config from '../../config';
import {IUser} from 'app/models/User';

interface PassportStrategyOptions {
	secretOrKey: string;
	[x: string]: any;
}

const jwtConf = config.get('jwt');
const users: IUser[] = config.get('users');

export const jwtOptions: PassportStrategyOptions  = {
	jwtFromRequest: ExtractJwt.fromAuthHeader(),
	secretOrKey: jwtConf.jwtSecret,
};

export function serializeUser(user: IUser, done: (err: string | null, id: number | null) => void) {
	done(null, user.id);
}

export function deserializeUser(id: number | null, done: (err: string | null, user?: IUser | null) => void) {
	// TODO rewrite it on DB added
	const user = users[_.findIndex(users, {id: id})];
	if (user) {
		done(null, user);
	} else {
		done('User not found');
	}
}

export const jwtStrategy = new JwtStrategy(jwtOptions, (jwtPayload, next) => {
	// TODO rewrite it on DB added
	const user = users[_.findIndex(users, {id: jwtPayload.id, login: jwtPayload.login})];
	if (user) {
		next(null, user);
	} else {
		next(null, false);
	}
});

export default { jwtStrategy, serializeUser, deserializeUser, jwtOptions };
