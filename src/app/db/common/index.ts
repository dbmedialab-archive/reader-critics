import {
	Document,
	Model,
} from 'mongoose';

import * as errors from 'app/db/errors';

import { isTest } from 'app/util/applib';

export function clearCollection <T extends Document> (model : Model <T>) : Promise <void> {
	if (isTest) {
		return model.remove({}).then(() => undefined);
	}
	throw new Error('Function can only be used in TEST mode');
}

export { default as wrapFind } from './wrapFind';

export function wrapSave(wrapped : Promise <Document>) : Promise <void> {
	return wrapped.then(() => undefined)
	.catch(error => Promise.reject(
		errors.isDuplicateError(error) ? new errors.DuplicateError(error) : error
	));
}
