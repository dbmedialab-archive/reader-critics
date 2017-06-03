import {
	Request,
	Response,
} from 'express';

import ArticleURL from 'base/ArticleURL';

import { Article } from 'app/services';
import { EmptyError } from 'app/util/errors';

import { okResponse } from './apiResponse';

import * as app from 'app/util/applib';

const log = app.createLog();

export default function(requ : Request, resp : Response) : void {
	log('Received feedback: %o', requ.body);
	okResponse(resp);
}
