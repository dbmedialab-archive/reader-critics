import Person from 'base/zz/Person';
import User from 'base/User';

import BasicPersistingService from '../BasicPersistingService';

interface UserService extends BasicPersistingService <User> {
	checkPassword(user : User, password : string) : Promise <boolean>;
	doDelete(id: String);
	get(username : String, email? : String|null) : Promise <User>;
	getByEmail(email : String) : Promise <User>;
	getByID(id : String) : Promise <User>;
	save(user : User) : Promise <User>;

	findOrInsert(user : Person) : Promise <User>;
	update(id: String, user : Person) : Promise <User>;

	validateAndSave(data : any) : Promise <User>;
	validateAndUpdate(id: String, data : Object) : Promise <User>;
}

export default UserService;
