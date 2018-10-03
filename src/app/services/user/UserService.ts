import { Person } from 'base/zz/Person';
import { User } from 'base/User';
import { UserRole } from 'base/UserRole';

import BasicPersistingService from '../BasicPersistingService';
import {UserDocument} from 'app/db/models';

interface UserService extends BasicPersistingService <User> {
	checkPassword(user : User, password : string) : Promise <boolean>;
	setPasswordHash(user : User, password: string) : Promise <User>;

	doDelete(id: string);

	get(username : string, email? : string|null) : Promise <User>;
	getRangeWithSearch(skip: number,
											limit: number,
											sort: Object,
											search?: string
	): Promise <UserDocument[]>
	getAmount() : Promise <number>;
	getByEmail(email : string) : Promise <User>;
	getByID(id : string) : Promise <User>;
	getByRole(whatRoles : UserRole[]) : Promise <User[]>;

	save(user : User) : Promise <User>;

	findOrInsert(user : Person) : Promise <User>;
	update(id : string, user : User) : Promise <User>;

	validateAndSave(data : any) : Promise <User>;
	validateAndUpdate(id : string, data : User) : Promise <User>;
}

export default UserService;
