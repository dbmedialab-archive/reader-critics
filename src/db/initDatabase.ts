import * as Promise from 'bluebird';

import * as Mongoose from 'mongoose';

const mongoURL = 'mongodb://localhost:27017/readercritics';

export default function () {
	return Mongoose.connect(mongoURL);
}
