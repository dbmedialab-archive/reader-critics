import * as bcrypt from 'bcrypt';

// import { User } from 'base';
import User from 'base/User';

// Password for mock environment is "test"
const adminPassword = '$2a$14$uH.TgIQi5Ed4RdRoFwWVaOBmnhAWDJYrnluZ6sMTj909ZDw7YTmpW';

export default function (user : User, password : string) : Promise <boolean> {
	if (user.name !== 'admin') {
		return Promise.resolve(false);
	}

	return bcrypt.compare(password, adminPassword);
}
