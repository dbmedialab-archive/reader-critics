import UserService from './UserService';

import { clear } from '../BasicPersistingService';

import get from './mock/get';

const service : UserService = {
	clear,
	get,
};

module.exports = service;
