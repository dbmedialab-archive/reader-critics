import User from 'base/User';

import BasicPersistingService from '../BasicPersistingService';

interface UserService extends BasicPersistingService <User> {
	checkPassword(user : User, password : string) : Promise <boolean>;
	get(username : string) : Promise <User>;
	save(user : User) : Promise <void>;
}

export default UserService;
