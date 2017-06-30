import * as express from 'express';

import { Application, Request, Response } from 'express';
import { parse } from 'url';

import apiRoute from './apiRoute';
import faviconRoute from './faviconRoute';
import feedbackRoute from './feedbackRoute';
import homeRoute from './homeRoute';
import suggestionRoute from './suggestionRoute';
import adminRoute from './admin/adminRoute';
import adminApiRoute from './admin/api/adminApiRoute';
import staticRoute from './staticRoute';

import * as app from 'app/util/applib';

const log = app.createLog();

// Main

export default function(expressApp : Application) {
	if (!app.isProduction) {
		expressApp.use(logRequest);
	}

	setOptions(expressApp);
	setRoutes(expressApp);
}

// Express routes

function setRoutes(expressApp : express.Application) {
	log('Setting Express routes');

	expressApp.use(faviconRoute);

	expressApp.use('/static', staticRoute);

	expressApp.use('/api', apiRoute);
	expressApp.use('/fb', feedbackRoute);
	expressApp.use('/suggestion-box', suggestionRoute);
	expressApp.use('/admin/api', adminApiRoute);
	expressApp.use('/admin', adminRoute);

	expressApp.use('/', homeRoute);
}

// Express application options

function setOptions(expressApp : express.Application) {
	log('Setting Express options');

	expressApp.set('view', undefined);
	expressApp.set('views', undefined);

	expressApp.set('x-powered-by', false);
}

// Log all express requests

function logRequest(requ : Request, resp: Response, next : Function) {
	const url = parse(requ.url);

	if (url.query === null) {
		log(url.pathname);
	}
	else {
		log(url.pathname, requ.query);
	}

	next();
}
