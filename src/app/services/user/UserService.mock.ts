import UserService from './UserService';

import { clear } from '../BasicPersistingService';

import checkPassword from './mock/checkPassword';
import get from './mock/get';

const service : UserService = {
	checkPassword,
	clear,
	get,
};

module.exports = service;
