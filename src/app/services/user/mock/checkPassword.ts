import * as bcrypt from 'bcrypt';

import { User } from 'base';

// Password for mock environment is "test"
const adminPassword = '$2a$14$JhMXQYuXQ4iT.9O5k9t2kedHNgzbw7yJN/73gsSVewk9pQmzDskXG';

export default function (user : User, password : string) : Promise <boolean> {
	if (user.name !== 'admin') {
		return Promise.resolve(false);
	}

	return bcrypt.compare(password, adminPassword);
}
