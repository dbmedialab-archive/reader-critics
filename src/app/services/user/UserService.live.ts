import UserService from './UserService';

import { clear } from '../BasicPersistingService';

import get from './mock/get';

// Use the mock implementation until database implementation is finished

const service : UserService = {
	clear,
	get,
};

module.exports = service;
