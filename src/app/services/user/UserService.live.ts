import UserService from './UserService';

import { clear } from '../BasicPersistingService';

import checkPassword from './mock/checkPassword';
import get from './mock/get';

// Use the mock implementation until database implementation is finished

const service : UserService = {
	checkPassword,
	clear,
	get,
};

module.exports = service;
