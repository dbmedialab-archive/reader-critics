import {
	User,
	UserRole
} from 'base';

export default function (username : string) : Promise <User> {
	if (username !== 'admin') {
		return Promise.resolve(null);
	}

	return Promise.resolve({
		name: 'admin',
		email: 'admin@examplemedia.no',
		role: UserRole.SystemAdmin,
	});
}
