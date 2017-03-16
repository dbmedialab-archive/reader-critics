import BaseModel from './base';

export default class Tag extends BaseModel {
	constructor (properties: Object) {
		super(['tagname']);
	}
}
