import { User } from 'base';

import BasicPersistingService from '../BasicPersistingService';

interface UserService extends BasicPersistingService {
	get(username : string) : Promise <User>;
}

export default UserService;
