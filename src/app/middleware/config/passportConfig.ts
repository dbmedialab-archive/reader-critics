import * as _ from 'lodash';
import * as jwt from 'jsonwebtoken';

import config from 'app/config';

import { User } from 'base';
import { userService } from 'app/services';

export type SerializeCallback = (err : string|null, username : string|null) => void;
export type RetrieveCallback = (err : string|null, user? : User) => void;

// export interface PassportJWTOptions {  FIXME unused code?
// 	secretOrKey: string;
// 	[x: string]: any;
// }

export { jwtStrategy } from './strategy/jwt';
export { localStrategy } from './strategy/local';

export function serializeUser(user : User, done: SerializeCallback) {
	done(null, user.name);
}

export function deserializeUser(username : string, done : RetrieveCallback) {
	userService.get(username).then((user : User) => {
		done(user === null ? 'User not found' : null, user)
	});
}
