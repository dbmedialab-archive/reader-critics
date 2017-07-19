import {
	Strategy,
	IStrategyOptions,
	IVerifyOptions,
	VerifyFunction,
} from 'passport-local';

import { User } from 'base';
import { userService } from 'app/services';

export const options : IStrategyOptions = {
	usernameField: 'login',
	passwordField: 'password',
	// session: true,
};

const verify : VerifyFunction = (
	username : string,
	password : string,
	done : (error: any, user?: any, options?: IVerifyOptions) => void
) => {
	userService.get(username).then((user : User) => {
		if (user === null) {
			return done('User not found');
		}


	});
};

export const localStrategy : Strategy = new Strategy(options, verify);
