import * as Bluebird from 'bluebird';
import * as nodeRead from 'node-read';

import * as app from 'app/util/applib';

const log = app.createLog();

const promisifiedRead : Function = Bluebird.promisify(nodeRead);

export interface NodeReadArticle {
	content : any;
	title : any;
}

export function create(rawArticle : string) : Promise <NodeReadArticle> {
	return promisifiedRead(rawArticle);
}
