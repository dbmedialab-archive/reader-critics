import {
	Document,
	Model,
} from 'mongoose';

import { isTest } from 'app/util/applib';

export default function <T extends Document> (model : Model <T>) : Promise <void> {
	if (isTest) {
		return model.remove({}).then(() => undefined);
	}
	throw new Error('Function can only be used in TEST mode');
}
