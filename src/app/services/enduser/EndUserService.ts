import EndUser from 'base/EndUser';

import BasicPersistingService from '../BasicPersistingService';

interface EndUserService extends BasicPersistingService <EndUser> {
	get(username : String|null, email? : String|null) : Promise <EndUser>;
	save(user : EndUser) : Promise <EndUser>;
}

export default EndUserService;
