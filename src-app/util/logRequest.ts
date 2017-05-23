import * as debug from 'debug';

import { Request, Response } from 'express';
import { parse } from 'url';

import { appName } from 'app/util/applib';

const log = debug(`${appName}:requ`);

export default function(requ : Request, resp: Response, next : Function) {
	const url = parse(requ.url);

	if (url.query === null) {
		log(url.pathname);
	}
	else {
		log(url.pathname, requ.query);
	}

	next();
}
