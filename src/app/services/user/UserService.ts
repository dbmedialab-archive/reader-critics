import Person from 'base/zz/Person';
import User from 'base/User';

import BasicPersistingService from '../BasicPersistingService';

interface UserService extends BasicPersistingService <User> {
	checkPassword(user : User, password : string) : Promise <boolean>;
	get(email : String|null) : Promise <User>;
	save(user : User) : Promise <User>;

	findOrInsert(user : Person) : Promise <User>;
}

export default UserService;
