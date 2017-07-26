import { User } from 'base';

import BasicPersistingService from '../BasicPersistingService';

interface UserService extends BasicPersistingService <User> {
	checkPassword(user : User, password : string) : Promise <boolean>;
	get(username : string) : Promise <User>;
}

export default UserService;
