import * as bcrypt from 'bcrypt';

import User from 'base/User';

// Password for mock environment is "test"
const adminPassword = '$2a$10$nrlEKXbpa9YQXacyUi6lN.Uj1y993hV9WDc5ZgFLNjz5c7mDevQt6';

export default function (user : User, password : string) : Promise <boolean> {
	if (user.name !== 'admin') {
		return Promise.resolve(false);
	}

	return bcrypt.compare(password, adminPassword);
}
