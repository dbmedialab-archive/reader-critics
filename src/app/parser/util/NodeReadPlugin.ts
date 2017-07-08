import * as Bluebird from 'bluebird';
import * as nodeRead from 'node-read';

const promisifiedRead : Function = Bluebird.promisify(nodeRead);

export interface NodeReadArticle {
	content : any;
	title : any;
}

export function create(rawArticle : string) : Promise <NodeReadArticle> {
	return promisifiedRead(rawArticle);
}
