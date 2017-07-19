import * as _ from 'lodash';
import * as jwt from 'jsonwebtoken';

import {
	ExtractJwt,
	Strategy as JwtStrategy,
	StrategyOptions as JwtStrategyOptions,
} from 'passport-jwt';

import {
	Strategy as LocalStrategy,
	IStrategyOptions as LocalStrategyOptions,
} from 'passport-local';

import config from '../../config';
import {IUser} from 'app/models/User';

import { User } from 'base';

export interface PassportJWTOptions {
	secretOrKey: string;
	[x: string]: any;
}

const jwtConf = config.get('jwt');
const users: IUser[] = config.get('users');

export const jwtOptions : JwtStrategyOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeader(),
	secretOrKey: jwtConf.jwtSecret,
};

export const localOptions : LocalStrategyOptions = {
	usernameField: 'login',
	passwordField: 'password',
	session: true,
};

export function serializeUser(user: IUser,
								done: (err: string | null, id: number | null) => void) {
	done(null, user.id);
}

export function deserializeUser(id: number | null,
								done: (err: string | null,	user?: IUser | null) => void) {
	// TODO rewrite it on DB added
	const user = users[_.findIndex(users, {id: id})];
	if (user) {
		done(null, user);
	} else {
		done('User not found');
	}
}

const jwtVerify = (jwtPayload, next: (err: string, user: IUser) => void) => {
	// TODO rewrite it on DB added
	const user = users[_.findIndex(users, {id: jwtPayload.id, login: jwtPayload.login})];
	if (user) {
		next(null, user);
	} else {
		next('User no found', null);
	}
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

const localVerify = (
	username: string,
	password: string,
	done: (err : string, token? : string, user? : IUser) => void) => {
	const user : User = {};

	// TODO rewrite it on DB added
	const _user = users[_.findIndex(users, {login: username})];
	if (!user) {
		return done('User not found');
	}
	user.comparePassword(password, function (err: string, isMatch: boolean) {
		if (isMatch) {
			const token = jwt.sign({ id: user.id, login: user.login }, jwtOptions.secretOrKey);
			done(null, token, user.toString());
		} else {
			done('Incorrect password');
		}
	});
};

export const localStrategy = new LocalStrategy(localOptions, localVerify);
