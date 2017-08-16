import User from 'base/User';
import UserRole from 'base/UserRole';

export default function (email : string) : Promise <User> {
	return Promise.resolve({
		name: 'admin',
		email: 'admin@examplemedia.no',
		role: UserRole.SystemAdmin,
	});
}
