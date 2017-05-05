import * as doT from 'dot';
import * as path from 'path';

import {
	Request,
	Response,
} from 'express';

import * as api from '../../../apilib';  // Oh a root import plugin would be nice ...

import parseArticleURL from './parseArticleURL';

const log = api.createLog();

const indexTemplate = doT.template("<h1>Here is a sample template <span>{{=it.foo}}</span> how awesome is that!</h1>");

export default function (requ : Request, resp : Response, articleURL : string) {
	log('feedback endpoint');
	log(`[${articleURL}]`);
	// 2. Use template function as many times as you like
	const resultText = indexTemplate({foo: articleURL});
	resp.json({ and_now: resultText }).status(200).end();
}
