import * as Promise from 'bluebird';
//import * as mongoose from 'mongoose';

const mongoose = require('mongoose');
mongoose.Promise = Promise;

const mongoURL = 'mongodb://localhost:27017/readercritics';

export function initDatabase() {
	return mongoose.connect(mongoURL);
}
