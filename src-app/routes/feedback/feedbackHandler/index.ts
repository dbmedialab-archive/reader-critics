import * as doT from 'dot';
import * as path from 'path';

import { readFileSync } from 'fs';

import {
	Request,
	Response,
} from 'express';

import * as api from '../../../apilib';  // Oh a root import plugin would be nice ...

const log = api.createLog();

//const indexTemplate = doT.template("<h1>Here is a sample template <span>{{=it.foo}}</span> how awesome is that!</h1>");

export default function (requ : Request, resp : Response, articleURL : string) {
	log('feedback endpoint');
	log(`[${articleURL}]`);

	// 2. Use template function as many times as you like
	//const resultText = indexTemplate({foo: articleURL});
	//resp.json({ and_now: resultText }).status(200).end();

	const indexPath = path.join(api.rootPath, 'assets/index.html');
	const indexHTML = readFileSync(indexPath);

	resp.set('Content-Type', 'text/html');
	resp.send(indexHTML);

	resp.status(200).end();
}
