import UserService from './UserService';

import { clear } from '../BasicPersistingService';

import checkPassword from './mock/checkPassword';
import count from './mock/count';
import get from './mock/get';
import getRange from './mock/getRange';

// Use the mock implementation until database implementation is finished

const service : UserService = {
	checkPassword,
	clear,
	count,
	get,
	getRange,
};

module.exports = service;
